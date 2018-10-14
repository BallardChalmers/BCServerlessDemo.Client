import 'rxjs/add/observable/of';
import 'rxjs/add/observable/of';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ApprovalStatus } from '../enum';
import { GridQuery } from '../search/gridquery.model';
import { GridQueryStateService, QueryKeys } from '../search/gridquerystateservice.service';
import { SearchResults } from '../search/searchresults.model';
import { LogService } from '../utilities/log.service';
import { Driver } from './driver.model';

@Injectable()
export class DriverService {
  constructor(private http: HttpClient,
    private logService: LogService,
    private sanitizer: DomSanitizer,
    private gridQueryStateService: GridQueryStateService) {
  }

  rootUrl = `${environment.apiEndpoint}/drivers`;

  get(id: string) {
    const url = `${this.rootUrl}?id=${id}`;
    return this.http.get<any>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getDrivers(name: string, approvedOnly?: boolean): Observable<SearchResults<Driver>> {
    this.gridQueryStateService.clearFilter(QueryKeys.Drivers);
    const query = this.gridQueryStateService.getQuery(QueryKeys.Drivers);
    this.gridQueryStateService.setSearchQuery(query, name);
    query.pageSize = 15;

    if (approvedOnly === undefined || approvedOnly === true) {
      query.filters = filter(query.filters, f => f.column !== 'ApprovalStatus'); // Remove any existing ApprovalStatus query first
      query.filters.push({ column: 'ApprovalStatus', value: ApprovalStatus.Approved.toString() });
    }

    return this.search(query);
  }

  search(gridQuery: GridQuery): Observable<SearchResults<Driver>> {
    const url = `${this.rootUrl}?${gridQuery.getQueryString()}`;

    return this.http.get<SearchResults<Driver>>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getPhotoUrl(driverId, photoId): SafeUrl {
    const url = `${environment.apiEndpoint}/DriverPhoto?documentId=${driverId}&photoId=${photoId}&random=${Math.random()}`;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  update(driver: Driver): Observable<Driver> {
    return this.http.put<any>(this.rootUrl, driver)
      .pipe(tap(r => this.logService.log(`Response for PUT ${this.rootUrl}:  `, r)));
  }

  create(driver: Driver): Observable<Driver> {
    return this.http.post<any>(this.rootUrl, driver)
      .pipe(tap(r => this.logService.log(`Response for POST ${this.rootUrl}:  `, r)));
  }

  delete(id: string): Observable<Driver> {
    const url = `${this.rootUrl}?id=${id}`;

    return this.http.delete<any>(url)
      .pipe(tap(r => this.logService.log(`Response for DELETE ${url}:  `, r)));
  }
}
