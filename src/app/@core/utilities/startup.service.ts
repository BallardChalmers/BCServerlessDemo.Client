import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { LogService } from './log.service';
import { Lookups } from './lookups.model';


@Injectable()
export class StartupService {
    constructor(private http: HttpClient, private logService: LogService) {
    }
    public lookups: Lookups;

    private startupUrl = `${environment.apiEndpoint}/startup`;

    getLookups(): Promise<Lookups> {
        return this.http.get<Lookups>(this.startupUrl)
            // .pipe(tap(r => this.logService.log(`Response for GET ${this.lookupsUrl}:  `, r)))
            .map(l => {
                this.lookups = l;
                return l;
            }).toPromise<Lookups>();
    }


}
