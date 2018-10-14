import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LogService } from '../utilities/log.service';
import { AdminOverview } from './AdminOverview.model';

@Injectable()
export class AdminOverviewService {
  constructor(private http: HttpClient, private logService: LogService) {
  }

  rootUrl = `${environment.apiEndpoint}/AppAdminDashboardOverview`;

  getOverview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(this.rootUrl)
      .pipe(tap(r => this.logService.log(`Response for GET ${this.rootUrl}:  `, r)));
  }
}
