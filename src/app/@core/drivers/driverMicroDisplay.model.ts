import { SafeUrl } from '@angular/platform-browser';

import { DriverMicro } from './driverMicro.model';

export class DriverMicroDisplay extends DriverMicro {
    constructor() {
        super();
        this.canSelect = false;
        this.selected = false;
    }

    edit: boolean;
    displayDocuments: boolean;
    photoUrl?: SafeUrl;
    canSelect: boolean;
    selected: boolean;
}
