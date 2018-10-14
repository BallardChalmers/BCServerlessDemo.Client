import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-inline-search',
    templateUrl: './inlinesearch.component.html',
    styleUrls: ['./inlinesearch.component.scss']
})

export class InlineSearchComponent {
    @Input() placeHolder = 'Search for...';

    private _searchText = '';

    @Input()
    set searchText(searchText: string) {
        this._searchText = searchText;
        this.showCancel = !!searchText;
    }
    get searchText(): string { return this._searchText; }

    @Output() searchEvent = new EventEmitter<string>();
    @Output() cancelEvent = new EventEmitter<void>();

    showCancel = false;

    constructor() {

    }

    search() {
        this.searchEvent.emit(this.searchText);
    }

    cancel() {
        this.searchText = '';
        this.cancelEvent.emit();
    }
}
