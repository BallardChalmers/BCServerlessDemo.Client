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
import { Organisation } from './organisation.model';
import { OrganisationToggle } from './organisationToggle.model';

@Injectable()
export class OrganisationService {
  constructor(private http: HttpClient,
    private logService: LogService,
    private sanitizer: DomSanitizer,
    private gridQueryStateService: GridQueryStateService) {
  }

  organisationsUrl = `${environment.apiEndpoint}/organisations`;

  get(id: string) {
    const url = `${this.organisationsUrl}?id=${id}`;
    return this.http.get<any>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getOrganisations(name: string, approvedOnly?: boolean): Observable<SearchResults<Organisation>> {
    const query = this.gridQueryStateService.getQuery(QueryKeys.Organisations);
    this.gridQueryStateService.setSearchQuery(query, name);
    query.pageSize = 15;
    if (approvedOnly === undefined || approvedOnly === true) {
      query.filters = filter(query.filters, f => f.column !== 'ApprovalStatus'); // Remove any existing ApprovalStatus query first
      query.filters.push({ column: 'ApprovalStatus', value: ApprovalStatus.Approved.toString() });
    }

    return this.search(query);
  }

  search(gridQuery: GridQuery): Observable<SearchResults<Organisation>> {
    const url = `${this.organisationsUrl}?${gridQuery.getQueryString()}`;

    return this.http.get<SearchResults<Organisation>>(url)
      .pipe(tap(r => this.logService.log(`Response for GET ${url}:  `, r)));
  }

  getPhotoUrl(organisationId, photoId): SafeUrl {
    const url = `${environment.apiEndpoint}/OrganisationPhoto?documentId=${organisationId}&photoId=${photoId}&random=${Math.random()}`;

    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  updateOrganisation(organisation: any): Observable<Organisation> {
    return this.http.put<any>(this.organisationsUrl, organisation)
      .pipe(tap(r => this.logService.log(`Response for PUT ${this.organisationsUrl}:  `, r)));
  }

  createOrganisation(organisation: any): Observable<Organisation> {
    return this.http.post<any>(this.organisationsUrl, organisation)
      .pipe(tap(r => this.logService.log(`Response for POST ${this.organisationsUrl}:  `, r)));
  }

  deleteOrganisation(organisation: any): Observable<Organisation> {
    return this.http.post<any>(this.organisationsUrl, organisation)
      .pipe(tap(r => this.logService.log(`Response for POST ${this.organisationsUrl}:  `, r)));
  }

  organisationToggle(organisation: Organisation): Observable<OrganisationToggle> {
    const url = `${environment.apiEndpoint}/organisationtoggle`;

    const orgToggle = new OrganisationToggle();
    orgToggle.organisationId = organisation.id;
    orgToggle.isDisabled = organisation.isDisabled;

    return this.http.post<OrganisationToggle>(url, orgToggle)
      .pipe(tap(r => this.logService.log(`Response for POST ${url}:  `, r)));
  }
}
