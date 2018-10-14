import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import {debounceTime} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApprovalStatus } from '../@core/enum';
import { OrganisationService } from '../@core/organisations/organisation.service';
import { Driver } from '../@core/drivers/driver.model';
import { DriverService } from '../@core/drivers/driver.service';
import { DriverDisplay } from '../@core/drivers/driverdisplay.model';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { Lookup } from '../@core/utilities/lookup.model';
import { StartupService } from '../@core/utilities/startup.service';

const URL = `${environment.apiEndpoint}/DriverPhoto`;

@Component({
    selector: 'app-driver-edit',
    templateUrl: './driveredit.component.html',
    styleUrls: ['./drivers.component.scss']
})

export class DriverEditComponent implements OnInit {
    @Input() driverInput: DriverDisplay = new DriverDisplay();
    @Input() canEditRagStatus: false;
    @Output() driverCreated = new EventEmitter<Driver>();
    @Output() driverUpdated = new EventEmitter<Driver>();
    @Output() editCancelled = new EventEmitter();
    public uploader: FileUploader = new FileUploader({ url: URL });
    driver: DriverDisplay;
    photoUrl: SafeUrl;
    hasBaseDropZoneOver = false;
    hasAnotherDropZoneOver = false;
    @ViewChild('fileInput') fileInput: ElementRef;

    searching = false;
    searchFailed = false;
    ragStatuses = new Array<Lookup>();
    formatMatches = (value: any) => value.name || '';


    constructor(private driverService: DriverService,
        private organisationService: OrganisationService,
        private startupService: StartupService,
        private roleCheck: RoleCheck) {
    }

    ngOnInit(): void {
        if (this.driverInput.photoId != null) {
            this.photoUrl = this.driverService.getPhotoUrl(this.driverInput.id, this.driverInput.photoId);
        }
        this.driver = cloneDeep(this.driverInput);
        this.uploader.onCompleteItem = this.onUploadComplete.bind(this);
        this.ragStatuses = this.startupService.lookups.ragStatuses;
    }



    save() {
        if (this.uploader.queue.length > 0) {
                this.uploader.options.additionalParameter = { driver: JSON.stringify(this.driver) };
                this.uploader.uploadAll();
            } else {
                if (this.driver.isNew) {
                    this.driverService.create(this.driver).subscribe(t => this.driverCreated.emit(t));
                } else {
                    this.driverService.update(this.driver).subscribe(t => this.driverUpdated.emit(t));
                }
            }
    }

    onUploadComplete(item: any, response: any, status: any, headers: any) {
        const parsed = JSON.parse(response);
        const driver = Object.assign(new Driver, parsed);

        this.driverUpdated.emit(driver);
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    openFileDialog(): void {
        const event = new MouseEvent('click', { bubbles: false });

        this.fileInput.nativeElement.dispatchEvent(event);
    }

    dateChanged(date: Date, property: Date) {
        property = date;
    }
}
