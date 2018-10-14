import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-display-bool',
    templateUrl: './displayBool.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class DisplayBoolComponent {
    @Input() boolValue?: boolean;
    @Input() textValue?: string;
}
