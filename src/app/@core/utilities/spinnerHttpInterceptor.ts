import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpinnerHttpInterceptor implements HttpInterceptor {

    private count = 0;

    constructor(private spinner: Ng4LoadingSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.count++;

        if (this.count === 1) {
            this.spinner.show();
        }

        return next.handle(req).finally(() => {
            this.count--;
            if (this.count === 0) {
                this.spinner.hide();
            }
        });
    }
}
