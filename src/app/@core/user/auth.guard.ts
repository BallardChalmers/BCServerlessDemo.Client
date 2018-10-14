import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MsalService } from './msal.service';
import { RoleCheck } from './roleCheck.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private msalService: MsalService,
    private roleCheck: RoleCheck,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // return true;
    return this.roleCheck.canActivate(state.url.split('?')[0]);
  }
}
