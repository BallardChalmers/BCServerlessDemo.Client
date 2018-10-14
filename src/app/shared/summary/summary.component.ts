import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-shared-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SummaryComponent {
    @Input() link = '';
    @Input() percentageText = '';
    @Input() section: string;
    @Input() count: number;
    @Input() total: number;
    @Input() iconClass: string;
    @Input() showPercentage = true;

    getPercentage(): number {
        return Math.round((this.total > 0 ? (this.count / this.total) : 0) * 100);
    }
}
