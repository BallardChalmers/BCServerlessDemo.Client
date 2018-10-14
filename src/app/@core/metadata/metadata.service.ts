import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LogService } from '../utilities/log.service';
import { Metadata } from './metadata.model';

@Injectable()
export class MetadataService {
  constructor(private http: HttpClient,
    private logService: LogService) {
  }

  rootUrl = `${environment.apiEndpoint}/metadata`;

  get() {
    return this.http.get<any>(this.rootUrl)
      .pipe(tap(r => this.logService.log(`Response for GET ${this.rootUrl}:  `, r)));
  }

  update(metadata: Metadata): Observable<Metadata> {
    return this.http.put<Metadata>(this.rootUrl, metadata)
      .pipe(tap(r => this.logService.log(`Response for PUT ${this.rootUrl}:  `, r)));
  }
}
