import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './confirmModal.component.html',
})
export class ConfirmModalComponent {
    @Input() title;
    @Input() message;
    @Input() htmlMessage;
    @Input() yesButtonText = 'Yes';
    @Input() noButtonText = 'No';
    @Input() hideNoButton = false;

    constructor(public activeModal: NgbActiveModal) { }
}
