import { Injectable } from '@angular/core';

@Injectable()
export class LogService {
    // Wrap console.log calls in case it is not available in the browser
    public log(message: any, ...args: any[]): void {
        // tslint:disable-next-line:no-unused-expression
        (window.console && window.console.log) && window.console.log(message, ...args);
    }
}
