import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { ApprovalStatus } from '../@core/enum';
import { OrganisationService } from '../@core/organisations/organisation.service';
import { OrganisationDisplay } from '../@core/organisations/organisationdisplay.model';

@Component({
    selector: 'app-organisation-display',
    templateUrl: './organisationdisplay.component.html',
})

export class OrganisationDisplayComponent implements OnInit {
    @Input() organisation = new OrganisationDisplay();
    @Input() canEdit = false;
    @Input() canCertify = false;
    @Input() canEnableDisable = false;
    @Input() commentMode = false;
    @Output() disable = new EventEmitter<void>();
    @Output() enable = new EventEmitter<void>();

    @Output() startEdit = new EventEmitter<void>();
    @Output() deleteOrganisation = new EventEmitter<string>();
    @Output() certify = new EventEmitter<void>();

    photoUrl: SafeUrl;

    constructor(private organisationService: OrganisationService) {

    }

    ngOnInit(): void {
        if (this.organisation.photoId != null) {
            this.photoUrl = this.organisationService.getPhotoUrl(this.organisation.id, this.organisation.photoId);
        }
    }
}
