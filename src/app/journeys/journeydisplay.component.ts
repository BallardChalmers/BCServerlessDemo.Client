import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { JourneyDisplay } from '../@core/journeys/journeyDisplay.model';
import { JourneyDetailsComponent } from './journeyDetails.component';
import {BrowserModule} from '@angular/platform-browser';
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
    selector: 'app-journey-display',
    templateUrl: './journeydisplay.component.html',
})

export class JourneyDisplayComponent implements OnInit {
    @Input() journey = new JourneyDisplay();
    @Input() canEdit = false;
    @Input() canCertify = false;
    @Input() canEnableDisable = false;
    @Input() commentMode = false;
    @Output() disable = new EventEmitter<void>();
    @Output() enable = new EventEmitter<void>();

    @Output() startEdit = new EventEmitter<void>();
    @Output() deleteJourney = new EventEmitter<string>();
    @Output() certify = new EventEmitter<void>();

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

    constructor(private journeyService: JourneyService,
        private roleCheck: RoleCheck,
        private startupService: StartupService) {

    }

    ngOnInit(): void {
    }

    edit(): void {
        this.journey.edit = true;
    }
}
