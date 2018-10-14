import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { GridQuery } from '../search/gridquery.model';
import { SearchResults } from '../search/searchresults.model';
import { LogService } from '../utilities/log.service';
import { ChangeRecord } from './changerecord.model';

@Injectable()
export class ChangeRecordService {

  private baseUrl = `${environment.apiEndpoint}/ChangeRecords`;

  constructor(private http: HttpClient, private logService: LogService) {
  }

  search(token: string, filter: GridQuery): Observable<SearchResults<ChangeRecord>> {
    const url = `${this.baseUrl}?${filter.getQueryString()}&token=${token}`;

    return this.http.get<SearchResults<ChangeRecord>>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getChangeRecord(id: string): Observable<ChangeRecord> {
    const url = `${this.baseUrl}?id=${id}`;

    return this.http.get<ChangeRecord>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }
}
