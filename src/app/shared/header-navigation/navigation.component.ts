import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AppUser } from '../../@core/user/AppUser.model';
import { MsalService } from '../../@core/user/msal.service';
import { UserManagementService } from '../../@core/user/userManagement.service';
import { RoleCheck } from '../../@core/user/roleCheck.service';
import { MenuItem } from './menuItem.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
    user: AppUser;
    showHide: boolean;
    showMenu = '';
    menuItems = new Array<MenuItem>();

    constructor(private msalService: MsalService,
        private userManagementService: UserManagementService,
        private roleCheck: RoleCheck) {
        this.showHide = true;
    }

    changeShowStatus() {
        this.showHide = !this.showHide;
    }

    logout() {
        this.msalService.logout();
    }

    login() {
        this.msalService.login();
    }

    isOnline(): boolean {
        return this.msalService.isOnline();
    }

    ngOnInit() {
        this.userManagementService.getUser().subscribe(u => {
            this.user = u;
        });

        this.roleCheck.currentUserMenuItemPermissions().map(menuItems => this.menuItems = menuItems).subscribe();
    }
}
