import { Component, NgModule, VERSION, Input, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
import { Journey, Address } from '../@core/journeys/journey.model';
import { JourneyDisplay } from '../@core/journeys/journeyDisplay.model';
import { JourneyService } from '../@core/journeys/journey.service';
import { Action, ApprovalAction, ApprovalStatus } from '../@core/enum';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { StartupService } from '../@core/utilities/startup.service';
import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions,
    IBox, IMarkerIconInfo, WindowRef, DocumentRef, MapServiceFactory,
    BingMapAPILoaderConfig, BingMapAPILoader, MapTypeId, BingMapService
} from 'angular-maps';

@Component({
    selector: 'app-journey-edit',
    templateUrl: './journeyedit.component.html',
    styleUrls: ['./journeys.component.scss']
})

export class JourneyEditComponent implements OnInit {
    @Input() journey: JourneyDisplay;
    @Input() canEdit: boolean;
    showingNewVersion = false;
    canSubmit = false;
    roleCanAddEdit = false;
    roleCanRequestCertificates = false;
    roleCanConfirmCertificates = false;
    status = ApprovalStatus;
    currentPickupAddress = '';
    currentDropoffAddress = '';

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
        this.currentPickupAddress = (this.journey !== null && this.journey.pickupAddress === null) 
            ? '' : this.journey.pickupAddress.name;
        this.currentDropoffAddress = (this.journey !== null && this.journey.dropoffAddress === null)
            ? '' : this.journey.dropoffAddress.name;

    }

    journeyUpdated(journey: JourneyDisplay) {
        this.journey = journey;
        if (this.journey.pickupAddress === null) {
            this.journey.pickupAddress = new Address();
        }
        this.journey.pickupAddress.name = this.currentPickupAddress;

        if (this.journey.dropoffAddress === null) {
            this.journey.dropoffAddress = new Address();
        }
        this.journey.dropoffAddress.name = this.currentDropoffAddress;

        const action = Action.AddEditJourney;
        this.roleCheck.canPerformAction(action).subscribe(result => {
            this.roleCanAddEdit = result;
        });
        this.canSubmit = this.roleCanAddEdit;
    }

    submitJourney() {
        if (this.journey.pickupAddress === null) {
            this.journey.pickupAddress = new Address();
        }
        this.journey.pickupAddress.name = this.currentPickupAddress;

        if (this.journey.dropoffAddress === null) {
            this.journey.dropoffAddress = new Address();
        }
        this.journey.dropoffAddress.name = this.currentDropoffAddress;

        const journeyEdit = cloneDeep(this.journey);
        journeyEdit.approvalStatus = ApprovalStatus.Approved;
        this.journeyService.update(journeyEdit).subscribe(c => {
            this.journey.dropoffLatitude = c.dropoffLatitude;
            this.journey.dropoffLongitude = c.dropoffLongitude;
            this.journey.dropoffAddress = c.dropoffAddress;
            this.journey.pickupLatitude = c.pickupLatitude;
            this.journey.pickupLongitude = c.pickupLongitude;
            this.journey.pickupAddress = c.pickupAddress;
            this.journey.edit = false;
        });
    }

    changeMarker() {
        console.log('Hmmm');
    }
}
