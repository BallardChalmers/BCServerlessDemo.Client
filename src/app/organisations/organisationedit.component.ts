import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import {debounceTime} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApprovalStatus } from '../@core/enum';
import { OrganisationService } from '../@core/organisations/organisation.service';
import { Organisation } from '../@core/organisations/organisation.model';
import { OrganisationDisplay } from '../@core/organisations/organisationdisplay.model';
import { RoleCheck } from '../@core/user/roleCheck.service';
import { Lookup } from '../@core/utilities/lookup.model';
import { StartupService } from '../@core/utilities/startup.service';

const URL = `${environment.apiEndpoint}/OrganisationPhoto`;

@Component({
    selector: 'app-organisation-edit',
    templateUrl: './organisationedit.component.html',
    styleUrls: ['./organisations.component.scss']
})

export class OrganisationEditComponent implements OnInit {
    @Input() organisationInput: OrganisationDisplay = new OrganisationDisplay();
    @Input() canEditRagStatus: false;
    @Output() organisationCreated = new EventEmitter<Organisation>();
    @Output() organisationUpdated = new EventEmitter<Organisation>();
    @Output() editCancelled = new EventEmitter();
    public uploader: FileUploader = new FileUploader({ url: URL });
    organisation: OrganisationDisplay;
    photoUrl: SafeUrl;
    hasBaseDropZoneOver = false;
    hasAnotherDropZoneOver = false;
    @ViewChild('fileInput') fileInput: ElementRef;

    searching = false;
    searchFailed = false;
    ragStatuses = new Array<Lookup>();
    formatMatches = (value: any) => value.name || '';


    constructor(private organisationService: OrganisationService,
        private startupService: StartupService,
        private roleCheck: RoleCheck) {
    }

    ngOnInit(): void {
        if (this.organisationInput.photoId != null) {
            this.photoUrl = this.organisationService.getPhotoUrl(this.organisationInput.id, this.organisationInput.photoId);
        }
        this.organisation = cloneDeep(this.organisationInput);
        this.uploader.onCompleteItem = this.onUploadComplete.bind(this);
        this.ragStatuses = this.startupService.lookups.ragStatuses;
    }



    save() {
        if (this.uploader.queue.length > 0) {
                this.uploader.options.additionalParameter = { organisation: JSON.stringify(this.organisation) };
                this.uploader.uploadAll();
            } else {
                if (this.organisation.isNew) {
                    this.organisationService.createOrganisation(this.organisation).subscribe(t => this.organisationCreated.emit(t));
                } else {
                    this.organisationService.updateOrganisation(this.organisation).subscribe(t => this.organisationUpdated.emit(t));
                }
            }
    }

    onUploadComplete(item: any, response: any, status: any, headers: any) {
        const parsed = JSON.parse(response);
        const organisation = Object.assign(new Organisation, parsed);

        this.organisationUpdated.emit(organisation);
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
