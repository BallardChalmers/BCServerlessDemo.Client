import { Component, Input, ViewEncapsulation } from '@angular/core';

import { RagStatus } from '../../@core/enum';

@Component({
    selector: 'app-rag-status',
    templateUrl: './ragstatus.component.html',
    styleUrls: ['./ragstatus.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class RagStatusComponent {
    @Input() status: number;
    @Input() reason: string;
    ragStatus = RagStatus;
}
