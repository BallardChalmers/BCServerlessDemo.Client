import { SafeUrl } from '@angular/platform-browser';

import { Driver } from './driver.model';

export class DriverDisplay extends Driver {
    constructor() {
        super();
        this.canSelect = false;
        this.selected = false;
    }

    edit: boolean;
    isNew: boolean;
    displayDocuments: boolean;
    photoUrl?: SafeUrl;
    canSelect: boolean;
    selected: boolean;
}
