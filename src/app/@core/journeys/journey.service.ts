import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { GridQuery } from '../search/gridquery.model';
import { GridQueryStateService, QueryKeys } from '../search/gridquerystateservice.service';
import { SearchResults } from '../search/searchresults.model';
import { LogService } from '../utilities/log.service';
import { Journey } from './journey.model';



@Injectable()
export class JourneyService {
  constructor(private http: HttpClient,
    private logService: LogService,
    private gridQueryStateService: GridQueryStateService) {
  }

  rootUrl = `${environment.apiEndpoint}/journeys`;

  get(code: string): Observable<Journey> {
    const url = `${this.rootUrl}?code=${code}`;
    return this.http.get<Journey>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getJourneys(name: string): Observable<SearchResults<Journey>> {
    const query = this.gridQueryStateService.getQuery(QueryKeys.Journeys);
    this.gridQueryStateService.setSearchQuery(query, name);
    query.pageSize = 15;
    return this.search(query);
  }

  search(filter: GridQuery): Observable<SearchResults<Journey>> {
    const url = `${this.rootUrl}?${filter.getQueryString()}`;

    return this.http.get<SearchResults<Journey>>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  update(item: Journey): Observable<Journey> {
    return this.http.put<any>(this.rootUrl, item)
      .pipe(tap(r => this.logService.log(`Response for PUT ${this.rootUrl}:  `, r)));
  }

  create(item: Journey): Observable<Journey> {
    return this.http.post<any>(this.rootUrl, item)
      .pipe(tap(r => this.logService.log(`Response for POST ${this.rootUrl}:  `, r)));
  }

  delete(id: string): Observable<Journey> {
    const url = `${this.rootUrl}?id=${id}`;

    return this.http.delete<any>(url)
      .pipe(tap(r => this.logService.log(`Response for DELETE ${url}:  `, r)));
  }


}
