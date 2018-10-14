import { Component, NgModule, VERSION, Input, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { Journey } from '../@core/journeys/journey.model';
import { JourneyService } from '../@core/journeys/journey.service';
import { Action, ApprovalAction, ApprovalStatus } from '../@core/enum';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { StartupService } from '../@core/utilities/startup.service';
import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions,
    IBox, IMarkerIconInfo, WindowRef, DocumentRef, MapServiceFactory,
    BingMapAPILoaderConfig, BingMapAPILoader, MapTypeId, BingMapService
} from 'angular-maps';

@Component({
    templateUrl: './journeyDetails.component.html',
    styleUrls: ['./journeyDetails.component.scss'],
})

export class JourneyDetailsComponent implements OnInit {

    @Input() journey: Journey;

    showingNewVersion = false;
    canSubmit = false;
    roleCanAddEdit = false;
    roleCanRequestCertificates = false;
    roleCanConfirmCertificates = false;
    status = ApprovalStatus;

    _markerTypeId = MarkerTypeId;
  _options: IMapOptions = {
    disableBirdseye: false,
    disableStreetside: false,
    navigationBarMode: 1,
    mapTypeId: MapTypeId.road,
    zoom: 13
  };
  _iconInfoPickup: IMarkerIconInfo = {
    markerType: MarkerTypeId.ScaledImageMarker,
    url: '/assets/icons/mapmarker.png',
    scale: 1,
    markerOffsetRatio: { x: 0.5, y: 1 }
  };

  _iconInfoDropoff: IMarkerIconInfo = {
    markerType: MarkerTypeId.ScaledImageMarker,
    url: '/assets/icons/mapmarker2.png',
    scale: 1,
    markerOffsetRatio: { x: 0.5, y: 1 }
  };

    constructor(
        private journeyService: JourneyService,
        private roleCheck: RoleCheck,
        private startupService: StartupService) {

    }

    ngOnInit(): void {
        
        /*
            const searchManager = new Microsoft.Maps.Search.SearchManager(map);
                var requestOptions = {
                    bounds: map.getBounds(),
                    where: 'Sevenoaks, Kent',
                    callback: function (answer, userData) {
                        map.setView({ bounds: answer.results[0].bestView });
                        map.entities.push(new Microsoft.Maps.Pushpin(answer.results[0].location));
                    }
                };
                searchManager.geocode(requestOptions);
            });
            */
    }

    journeyUpdated(journey: Journey) {
        this.journey = journey;
        const action = Action.AddEditJourney;
        this.roleCheck.canPerformAction(action).subscribe(result => {
            this.roleCanAddEdit = result;
        });
        this.canSubmit = this.roleCanAddEdit;
    }

    submitJourney() {
        const journeyEdit = cloneDeep(this.journey);
        journeyEdit.approvalStatus = ApprovalStatus.Approved;
        this.journeyService.update(journeyEdit).subscribe(c => {
            this.journey = c;
        });
    }

    changeMarker() {
        console.log('Hmmm');
    }
}
