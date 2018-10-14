import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';

import { ViewportCollectionService } from '../../@core/utilities/viewportcollection.service';

@Component({
    selector: 'app-viewport',
    templateUrl: './viewport.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ViewportComponent {
    @Input() viewport: ViewportCollectionService<any> = new ViewportCollectionService<any>();
    @Input() cssClass: string;
    @ContentChild(TemplateRef)
    template: any;
    @Output() onLoadMore: EventEmitter<number> = new EventEmitter<number>();

    constructor() {

    }

    loadMore() {
        this.viewport.loadMore();
        this.onLoadMore.emit(this.viewport.displayed);
    }
}
