import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '../@core/enum';
import { MsalService } from '../@core/user/msal.service';
import { UserManagementService } from '../@core/user/userManagement.service';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    hasRole = true;

    constructor(private msalService: MsalService, private router: Router,
        private userManagementService: UserManagementService) {

    }

    ngOnInit() {
        const msalUser = this.msalService.getUser();
        if (msalUser == null) {
            this.msalService.login();
        }

        this.userManagementService.getUser().subscribe(user => {
            const userRole = user.appRole;

            switch (userRole) {
                case Role.Admin: {
                    this.router.navigateByUrl('/dashboard/admin');
                    break;
                }
                case Role.Manager: {
                    this.router.navigateByUrl('/dashboard/manager');
                    break;
                }
                case Role.OrgAdmin: {
                    this.router.navigateByUrl('/dashboard/orgadmin');
                    break;
                }
                case Role.Driver: {
                    this.router.navigateByUrl('/dashboard/driver');
                    break;
                }
                default: {
                    this.hasRole = false;
                }
            }
        });
    }
}
