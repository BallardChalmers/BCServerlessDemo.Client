import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { every, filter, find, forEach, map, some, sumBy, take, union } from 'lodash';
import * as moment from 'moment';

import { Journey } from '../@core/journeys/Journey.model';
import { JourneyService } from '../@core/journeys/journey.service';
import { Action, ApprovalStatus } from '../@core/enum';
import { OrganisationService } from '../@core/organisations/organisation.service';
import { GridQuery } from '../@core/search/gridquery.model';
import { GridQueryStateService, QueryKeys } from '../@core/search/gridquerystateservice.service';
import { Driver } from '../@core/drivers/driver.model';
import { DriverService } from '../@core/drivers/driver.service';
import { DriverDisplay } from '../@core/drivers/driverdisplay.model';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { UserManagementService } from '../@core/user/userManagement.service';
import { StartupService } from '../@core/utilities/startup.service';

@Component({
    templateUrl: './addJourney.component.html',
    styleUrls: ['./journeyDetails.component.scss'],
})
export class AddJourneyComponent implements OnInit {

    @Output() journeyAdded = new EventEmitter<Journey>();

    journey: Journey;
    drivers: Array<DriverDisplay>;
    driversView: Array<DriverDisplay>;
    driverPageSize = 9;
    driverFilterOn = false;
    minStartDate: NgbDateStruct;
    maxStartDate: NgbDateStruct;
    isDriverBusy = false;
    journeys: Array<Journey>;
    busyJourneys: Array<Journey>;
    durationHours = 0;
    endTimeInvalid = false;

    constructor(public activeModal: NgbActiveModal,
        private driverService: DriverService,
        private journeyService: JourneyService,
        private gridQueryStateService: GridQueryStateService,
        private userManagementService: UserManagementService,
        private organisationService: OrganisationService,
        private startupService: StartupService,
        private roleCheck: RoleCheck) {

    }

    ngOnInit(): void {
        const now = moment();
        this.minStartDate = { year: now.year(), month: now.month() + 1, day: now.day() };
        const max = now.add(3, 'months');
        this.maxStartDate = { year: max.year(), month: max.month() + 1, day: max.day() };

        this.journey = new Journey();
        const driverGridQuery = new GridQuery();
        driverGridQuery.pageSize = 1000;
        driverGridQuery.filters.push({ column: 'Disabled', value: 'false' });
        this.driverService.search(driverGridQuery).subscribe(response => {
            const availableDrivers = filter(response.results, t => t.hasExpiredMandatoryDocs === false);
            this.drivers = this.mapDrivers(availableDrivers);
            this.driversView = take(this.drivers, this.driverPageSize);

            this.roleCheck.canPerformAction(Action.AddHeaJourney).subscribe(canAddHeaJourney => {
                const journeyGridQuery = new GridQuery();
                journeyGridQuery.pageSize = 1000;
                this.journeyService.search(journeyGridQuery).subscribe(acResponse => {
                    this.journeys = canAddHeaJourney ? acResponse.results : filter(acResponse.results, a => a.heaOnly === false);
                    this.mapJourneys();
                });
            });
        });
    }


    private mapDrivers(drivers: Array<Driver>) {
        const driversMapped = map(drivers, t => {
            const td = <DriverDisplay>t;
            td.canSelect = true;
            if (td.photoId != null) {
                td.photoUrl = this.driverService.getPhotoUrl(td.id, td.photoId);
            }
            return td;
        });
        return driversMapped;
    }

    private mapJourneys() {
        const journeys = this.journeys;
        forEach(journeys, ap => {
            // is this needed now?
        });
    }

    pickupDateChange(date: Date) {
        this.journey.pickupDate = date;
        this.checkDriverBusy();
    }



    DriverSelect(driver: DriverDisplay) {
        if (!driver.canSelect) {
            return false;
        }

        forEach(this.drivers, t => {
            t.selected = t.id === driver.id ? !t.selected : false;
        });

        this.checkDriverBusy();
    }

    selectedDriver() {
        return find(this.drivers, t => t.selected);
    }

    checkDriverBusy() {
        this.isDriverBusy = false;

        const driver = this.selectedDriver();
        const pickupDate = this.journey.pickupDate;
        const dropoffDate = this.journey.dropoffDate;
        if (!!driver && !!pickupDate && !!dropoffDate) {
            // Check whether Driver is already running a Journey on the same day
            this.gridQueryStateService.clearFilter(QueryKeys.Journeys);
            const query = this.gridQueryStateService.getQuery(QueryKeys.Journeys);
            query.filters.push({ column: 'DriverId', value: driver.id });
            query.filters.push({ column: 'StartDateEquals', value: `${moment(pickupDate).format('YYYY-MM-DD')}` });
            query.pageSize = 10;
        }
    }

    filterDrivers(searchText: string) {
        this.driversView = filter(this.drivers, t => t.name.search(new RegExp(searchText, 'i')) >= 0);
        this.driverFilterOn = true;
    }

    cancelDriverFilter() {
        this.driverPageSize = 9;
        this.driversView = take(this.drivers, this.driverPageSize);
        this.driverFilterOn = false;
    }

    loadMoreDrivers() {
        this.driverPageSize += 9;
        this.driversView = take(this.drivers, this.driverPageSize);
    }


    canSave() {
        const canSave = this.journey.pickupDate !== undefined &&
            this.journey.pickupLatitude !== undefined &&
            some(this.drivers, t => t.selected);

        return canSave;
    }

    save() {
        this.journey.driver = this.selectedDriver();

        this.userManagementService.getUser().subscribe(user => {
            if (!!user.organisationId) {
                this.organisationService.get(user.organisationId).subscribe(org => {
                    this.journey.driver.organisation = org;
                    this.createJourney();
                });
            } else {
                this.createJourney();
            }
        });
    }

    createJourney() {
        this.journeyService.create(this.journey).subscribe(c => {
            this.journeyAdded.emit(c);
            this.activeModal.close();
        });
    }
}
