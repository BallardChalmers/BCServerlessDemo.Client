import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { findIndex, map } from 'lodash';

import { JourneyService } from '../@core/journeys/journey.service';
import { JourneyDisplay } from '../@core/journeys/journeyDisplay.model';
import { Action } from '../@core/enum';
import { GridQueryStateService, QueryKeys } from '../@core/search/gridquerystateservice.service';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { UserManagementService } from '../@core/user/userManagement.service';
import { ViewportCollectionService } from '../@core/utilities/viewportcollection.service';
import { ConfirmModalComponent } from '../shared/confirmModal/confirmModal.component';
import { AddJourneyComponent } from './addJourney.component';
import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions,
    IBox, IMarkerIconInfo, WindowRef, DocumentRef, MapServiceFactory,
    BingMapAPILoaderConfig, BingMapAPILoader
} from 'angular-maps';

@Component({
    templateUrl: './journeys.component.html',
    styleUrls: ['./journeys.component.scss'],
})
export class JourneysComponent implements OnInit {
    viewableJourneys = new ViewportCollectionService<JourneyDisplay>();

    orgName = '';
    totalJourneys = 0;
    validJourneys = 0;

    searching = false;
    searchFailed = false;
    canAddEdit = false;
    searchText = '';
    pageSize = 10;

    largeModalOptions: NgbModalOptions = { size: 'lg', backdrop: 'static', keyboard: false };

    constructor(private journeyService: JourneyService,
        private roleCheck: RoleCheck,
        private route: ActivatedRoute,
        private gridQueryStateService: GridQueryStateService,
        private modalService: NgbModal,
        private vcr: ViewContainerRef,
        private userManagementService: UserManagementService) {
    }

    ngOnInit(): void {
        this.roleCheck.canPerformAction(Action.AddEditJourney).subscribe(r => this.canAddEdit = r);
        this.userManagementService.getUser().subscribe(user => this.orgName = user.organisationName);

        const name = this.route.snapshot.queryParams['name'] !== undefined ? this.route.snapshot.queryParams['name'] : '';
        this.search(name);
    }

    search(searchText: string) {
        this.searchText = searchText;
        this.getJourneys();
    }

    cancelSearch() {
        this.searchText = '';
        this.getJourneys();
    }

    getJourneys() {
        const query = this.gridQueryStateService.getQuery(QueryKeys.Journeys);
        this.gridQueryStateService.setSearchQuery(query, this.searchText);
        query.pageSize = this.pageSize;

        this.journeyService.search(query)
            .subscribe(response => {
                this.viewableJourneys.collection = map(response.results, c => <JourneyDisplay>c);
                this.viewableJourneys.total = response.count;
            });
    }

    loadMore(pageSize: number) {
        this.pageSize = pageSize;
        this.getJourneys();
    }

    displayDetails(item: JourneyDisplay) {
        item.displayDetails = !item.displayDetails;
    }

    openAddJourneyModal() {
        const modalRef = this.modalService.open(AddJourneyComponent, this.largeModalOptions);
        const addJourneyComponent: AddJourneyComponent = modalRef.componentInstance;
        addJourneyComponent.journeyAdded.subscribe(journey => {
            this.viewableJourneys.collection.unshift(<JourneyDisplay>journey);
            this.viewableJourneys.total++;
            this.viewableJourneys.reset();
        });
    }



    deleteJourney(id: string) {
        const modalRef = this.modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = 'Confirm Delete';
        modalRef.componentInstance.message = 'Are you sure you want to delete the Journey?';

        modalRef.result.then((response) => {
            if (response === true) {
                const index = findIndex(this.viewableJourneys.collection, fi => fi.id === id);

                this.journeyService.delete(id).subscribe((journey) => {
                    if (journey.deleted) {
                        this.viewableJourneys.collection.splice(index, 1);
                        this.viewableJourneys.total--;
                        this.viewableJourneys.reset();
                    } else {
                        this.viewableJourneys.collection.splice(index, 1, <JourneyDisplay>journey);
                        this.viewableJourneys.reset();
                    }
                });
            }
        });
    }


}
