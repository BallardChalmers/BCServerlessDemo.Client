import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LogService } from '../utilities/log.service';
import { AppCreateUser } from './appCreateUser.model';
import { AppUser } from './AppUser.model';
import { MsalService } from './msal.service';

@Injectable()
export class UserManagementService {
  constructor(private http: HttpClient,
    private logService: LogService,
    private msalService: MsalService) {
  }

  baseUrl = `${environment.apiEndpoint}/Users`;

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.baseUrl)
      .pipe(tap(r => console.log(`Response for GET ${this.baseUrl}:  `, r)));
  }

  searchUsers(searchTerm: string): Observable<AppUser[]> {
    const url = `${this.baseUrl}?SearchTerm=${searchTerm}`;

    return this.http.get<AppUser[]>(url)
      .pipe(tap(r => console.log(`Response for GET ${url}:  `, r)));
  }

  getUser(): Observable<AppUser> {
    if (sessionStorage.getItem('AppUser') != null) {
      return Observable.of(JSON.parse(sessionStorage.getItem('AppUser')));
    }

    const msalUser = this.msalService.getUser();
    const url = `${this.baseUrl}?userId=${msalUser.displayableId}`;
    return this.http.get<AppUser[]>(url)
      .pipe(tap(r => console.log(`Response for GET ${url}:  `, r)))
      .map(response => {
        const users = new Array<AppUser>();
        response.forEach(d => users.push(Object.assign(new AppUser(), d)));
        sessionStorage.setItem('AppUser', JSON.stringify(users[0]));
        return users;
      }).concatMap(r => r);
  }

  getUsersInOrganisation(organisationId: string): Observable<AppUser[]> {
    const url = `${this.baseUrl}?organisationId=${organisationId}`;

    return this.http.get<AppUser[]>(url)
      .pipe(tap(r => console.log(`Response for GET ${url}:  `, r)))
      .map(response => {
        const users = new Array<AppUser>();
        response.forEach(d => users.push(Object.assign(new AppUser(), d)));
        return users;
      });
  }

  updateUser(user: AppUser): Observable<void> {
    return this.http.put<void>(this.baseUrl, user)
      .pipe(tap(r => this.logService.log(`Response for PUT ${this.baseUrl}: `, r)));
  }

  deleteUser(user: AppUser): Observable<void> {
    user.accountEnabled = false;

    return this.updateUser(user);
  }

  createUser(user: AppUser): Observable<AppUser> {
    const newUser = new AppCreateUser();
    newUser.accountEnabled = true;
    newUser.signInNames = user.signInNames;
    newUser.creationType = 'LocalAccount';
    newUser.displayName = user.displayName;
    newUser.mailNickname = user.displayName.replace(/\s+/g, '');
    newUser.organisationId = user.organisationId;
    newUser.organisationName = user.organisationName;
    newUser.appRole = user.appRole;
    newUser.appRoleDisplayName = user.appRoleDisplayName;
    newUser.trainerId = user.trainerId;

    // TODO: Generate random password and mail to user
    newUser.passwordProfile = { password: 'Pa55word!!!', forceChangePasswordNextLogin: true };
    newUser.passwordPolicies = 'DisablePasswordExpiration';
    newUser.givenName = user.givenName;
    newUser.surname = user.surname;

    return this.http.post<AppUser>(this.baseUrl, newUser)
      .pipe(tap(r => this.logService.log(`Response for POST ${this.baseUrl}:  `, r)));
  }

  postDemo(): void {
    const url = `${environment.apiEndpoint}/Demo`;
    this.http.get(url).subscribe(response => {
      console.log('Demo response: ' + response);
    });
  }
}
