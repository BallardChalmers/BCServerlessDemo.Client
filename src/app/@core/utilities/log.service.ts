import { Injectable, Injector } from '@angular/core';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class LogService {

    private logInjector: Injector;

    constructor(private injector: Injector) {
    }

    // Wrap console.log calls in case it is not available in the browser
    public log(message: any, ...args: any[]): void {
        const monitoringService = this.injector.get(MonitoringService);
        monitoringService.logEvent('Client event', {'message': message});

        // tslint:disable-next-line:no-unused-expression
        (window.console && window.console.log) && window.console.log(message, ...args);
    }
}
