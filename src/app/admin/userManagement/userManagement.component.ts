import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { findIndex, map } from 'lodash';

import { AppUser } from '../../@core/user/appUser.model';
import { Action } from '../../@core/enum';
import { UserManagementService } from '../../@core/user/userManagement.service';
import { RoleCheck } from '../../@core/user/roleCheck.service';
import { ViewportCollectionService } from '../../@core/utilities/viewportcollection.service';

@Component({
    templateUrl: './userManagement.component.html',
    styleUrls: [],
})
export class UserManagementComponent implements OnInit {
    viewableUsers = new ViewportCollectionService<AppUser>();
    canAddEdit = false;
    orgName: string;

    constructor(private roleCheck: RoleCheck,
        private route: ActivatedRoute,
        private userManagementService: UserManagementService) {
    }

    ngOnInit(): void {
        this.roleCheck.canPerformAction(Action.AddEditJourney).subscribe(r => this.canAddEdit = r);
        this.userManagementService.getAllUsers().subscribe(allUsers => {
            this.viewableUsers.collection = map(allUsers, c => <AppUser>c);
        });
    }

    edit(): void {

    }

}
