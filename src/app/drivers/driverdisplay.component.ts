import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { ApprovalStatus } from '../@core/enum';
import { DriverService } from '../@core/drivers/driver.service';
import { DriverDisplay } from '../@core/drivers/driverdisplay.model';

@Component({
    selector: 'app-driver-display',
    templateUrl: './driverdisplay.component.html',
})

export class DriverDisplayComponent implements OnInit {
    @Input() driver = new DriverDisplay();
    @Input() canEdit = false;
    @Input() canCertify = false;
    @Input() canEnableDisable = false;
    @Input() commentMode = false;
    @Output() disable = new EventEmitter<void>();
    @Output() enable = new EventEmitter<void>();

    @Output() startEdit = new EventEmitter<void>();
    @Output() deleteDriver = new EventEmitter<string>();
    @Output() certify = new EventEmitter<void>();

    photoUrl: SafeUrl;

    constructor(private driverService: DriverService) {

    }

    ngOnInit(): void {
        if (this.driver.photoId != null) {
            this.photoUrl = this.driverService.getPhotoUrl(this.driver.id, this.driver.photoId);
        }
    }
}
