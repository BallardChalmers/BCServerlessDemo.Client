import { Injectable } from '@angular/core';
import { filter, forEach, some } from 'lodash';
import { Observable } from 'rxjs/Observable';

import { MenuItem } from '../../shared/header-navigation/menuItem.model';
import { Action, Role } from '../enum';
import { OrganisationService } from '../organisations/organisation.service';
import { DriverService } from '../../@core/drivers/driver.service';
import { LogService } from '../utilities/log.service';
import { AppUser } from './appUser.model';
import { MsalService } from './msal.service';
import { RoleModel } from './role.model';
import { UserManagementService } from './userManagement.service';

@Injectable()
export class RoleCheck {

  roles: Array<RoleModel> = [
    { value: Role.Admin, name: 'Admin' },
    { value: Role.Manager, name: 'Manager' },
    { value: Role.OrgAdmin, name: 'Organisation Admin' },
    { value: Role.Driver, name: 'Driver' },
  ];

  roleDisplayNames: Array<RoleModel> = [
    { value: Role.Admin, name: 'Admin' },
    { value: Role.Admin, name: 'Support' },
    { value: Role.Manager, name: 'Manager' },
    { value: Role.OrgAdmin, name: 'Organisation Admin' },
    { value: Role.OrgAdmin, name: 'Manager' },
    { value: Role.Driver, name: 'Driver' },
  ];

  menu = new Array<MenuItem>();

  constructor(private msalService: MsalService,
    private userManagementService: UserManagementService,
    private logService: LogService,
    private organisationService: OrganisationService,
    private driverService: DriverService) {
    this.initMenu();
  }

  initMenu() {
    this.menu.push(new MenuItem('Dashboard', [Role.Admin], '/dashboard/admin', 'mdi mdi-gauge'));
    this.menu.push(new MenuItem('Dashboard', [Role.Manager], '/dashboard/manager', 'mdi mdi-gauge'));
    this.menu.push(new MenuItem('Dashboard', [Role.OrgAdmin], '/dashboard/orgadmin', 'mdi mdi-gauge'));
    this.menu.push(new MenuItem('Dashboard', [Role.Driver], '/dashboard/driver', 'mdi mdi-gauge'));

    const approvedJourneys = new MenuItem('Approved Journeys',
      [Role.Admin, Role.Manager, Role.Driver, Role.OrgAdmin], '/approvedjourneys', 'fa fa-book');

    const journeys = new MenuItem('Journeys',
      [Role.Admin, Role.Manager, Role.Driver, Role.OrgAdmin], '/journeys', 'fa fa-institution');

    const orgs = new MenuItem('Organisations',
      [Role.Admin, Role.Manager, Role.OrgAdmin], '/organisations', 'fa fa-sitemap');
    orgs.displayRoles = [Role.Admin, Role.Manager];

    const Drivers = new MenuItem('Drivers',
      [Role.Admin, Role.Manager, Role.Driver, Role.OrgAdmin], '/drivers', 'fa fa-mortar-board');

    const audit = new MenuItem('Audit',
      [Role.Admin, Role.Manager, Role.OrgAdmin], '/audit', 'fa fa-file-text');

    const approvals = new MenuItem('Approvals', [Role.Admin, Role.Manager],
      '/approvals', 'mdi mdi-checkbox-marked-circle-outline');

    const reports = new MenuItem('Reports', [Role.Admin, Role.Manager], '/reports', 'fa fa-bar-chart-o');

    const admin = new MenuItem('Admin', [Role.Admin, Role.Manager]);
    admin.iconClass = 'fa fa-cog';
    admin.children.push(new MenuItem('Manage Approved Journeys', [Role.Admin, Role.Manager], '/admin/manageapprovedjourneys'));
    admin.children.push(new MenuItem('User Management', [Role.Admin, Role.Manager], '/admin/usermanagement'));
    admin.children.push(new MenuItem('Change Records', [Role.Admin, Role.Manager], '/admin/changerecords'));
    admin.children.push(new MenuItem('Audit Questions', [Role.Admin, Role.Manager], '/admin/auditquestions'));
    admin.children.push(new MenuItem('Metadata', [Role.Admin, Role.Manager], '/admin/metadata'));
    admin.children.push(new MenuItem('Organisation Required Documents', [Role.Admin, Role.Manager], '/admin/requireddocuments'));
    admin.children.push(new MenuItem('Manually recertify', [Role.Admin, Role.Manager], '/admin/manualrecertify'));
    admin.children.push(new MenuItem('Event reminder', [Role.Admin, Role.Manager], '/admin/eventreminder'));
    admin.children.push(new MenuItem('Messages', [Role.Admin, Role.Manager], '/admin/messages'));
    admin.children.push(new MenuItem('Printouts', [Role.Admin, Role.Manager], '/admin/printouts'));

    this.menu.push(approvedJourneys);
    this.menu.push(journeys);
    this.menu.push(orgs);
    this.menu.push(Drivers);
    this.menu.push(audit);
    this.menu.push(approvals);
    this.menu.push(reports);
    this.menu.push(admin);
  }

  roleRequiresApproval(): Observable<boolean> {
    if (this.checkLogin() === false) {
      return Observable.of(false);
    }

    return this.userManagementService.getUser().map(user => {
      return this.userRequiresApproval(user);
    });
  }

  userRequiresApproval(user: AppUser): boolean {
    const userRole = user.appRole;
    return userRole === Role.OrgAdmin || userRole === Role.Driver;
  }

  canPerformAction(action: Action): Observable<boolean> {
    if (this.checkLogin() === false) {
      return Observable.of(false);
    }

    return this.userManagementService.getUser().map(user => {
      let result = false;

      const userRole = user.appRole;
      switch (action) {
        case Action.RequestAudit:
        case Action.EnableDisableOrg:
        case Action.AddOrg:
        case Action.EditApprovedJourney:
        case Action.FilterByOrg:
        case Action.AddEditReadOnlyJourney:
        case Action.ConfirmCertificates:
        case Action.EditDriverRagStatus:
        case Action.EnableDisableDriver:
        case Action.AddHeaJourney:
        case Action.PrintCertificates:
          {
            result = userRole === Role.Admin || userRole === Role.Manager;
            break;
          }
        case Action.EditOrg:
        case Action.AddEditDriver:
        case Action.AddEditJourney:
        case Action.AddLearner:
        case Action.DeleteJourney:
          {
            result = userRole === Role.Admin || userRole === Role.Manager || userRole === Role.OrgAdmin;
            break;
          }
        case Action.CertifyOrg:
          {
            result = userRole === Role.OrgAdmin;
            break;
          }
        case Action.CertifyDriver:
          {
            result = userRole === Role.Driver;
            break;
          }
      }

      this.logService.log(`canPerformAction ${action}: ${result}.`);
      return result;
    });
  }

  canActivate(url: string): Observable<boolean> {
    if (this.checkLogin() === false) {
      return Observable.of(false);
    }

    return this.userManagementService.getUser().map(user => {

      const userRole = user.appRole;

      const hasMenu = some(this.menu, mi => mi.link === url && some(mi.roles, r => r === userRole));
      if (hasMenu) {
        this.logService.log(`Role ${userRole} granted access to Url: ${url}`);
        return true;
      }

      const hasChildMenu = some(this.menu, item =>
        item.children.length > 0 && some(item.children, c => c.link === url && some(c.roles, r => r === userRole)));

      if (hasChildMenu) {
        this.logService.log(`Role ${userRole} granted access to Url: ${url}`);
      } else {
        this.logService.log(`Role ${userRole} denied access to Url: ${url}`);
      }
      return hasChildMenu;
    });
  }

  currentUserMenuItemPermissions(): Observable<Array<MenuItem>> {

    if (this.checkLogin() === false) {
      return Observable.of(new Array<MenuItem>());
    }

    return this.userManagementService.getUser().mergeMap(user => {

      const userRole = user.appRole;

      const userMenu = filter(this.menu, m => some(m.displayRoles, r => r === userRole));
      forEach(userMenu, item => {
        if (item.children.length > 0) {
          item.children = filter(item.children, c => some(c.displayRoles, r => r === userRole));
        }
      });

      return this.checkCertifications(user, userMenu);
    });

  }

  private checkCertifications(user: AppUser, menuItems: Array<MenuItem>): Observable<Array<MenuItem>> {
    if (user.appRole === Role.OrgAdmin && !!user.organisationId) {
      return this.organisationService.get(user.organisationId).map(org => {
        if (org && org.certified === false) {
          const recertifyOrg = new MenuItem('Certify Organisation',
            [Role.OrgAdmin], '/organisations', 'icon-badge');
          recertifyOrg.isCertificationLink = true;
          menuItems.splice(3, 0, recertifyOrg);
        }
        return menuItems;
      });
    } else if (user.appRole === Role.Driver && !!user.driverId) {
      return this.driverService.get(user.driverId).map(Driver => {
        if (Driver && Driver.certified === false) {
          const recertifyDriver = new MenuItem('Certify Driver',
            [Role.OrgAdmin], '/Drivers', 'icon-badge');
          recertifyDriver.isCertificationLink = true;
          menuItems.splice(5, 0, recertifyDriver);
        }
        return menuItems;
      });
    } else {
      return Observable.of(menuItems);
    }
  }

  checkLogin(): boolean {
    if (this.msalService.isOnline()) { return true; }

    // Store the attempted URL for redirecting
    // this.msalService.redirectUrl = url;

    this.msalService.login();
    // this.router.navigateByUrl(url);
    return false;
  }
}
