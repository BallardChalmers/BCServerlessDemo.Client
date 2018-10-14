import { Routes } from '@angular/router';

import { AuthGuard } from '../@core/user/auth.guard';
import { AdminDashboardComponent } from './admin/adminDashboard.component';
// import { ManagerDashboardComponent } from './heamanager/heamanagerDashboard.component';
// import { DriverDashboardComponent } from './driver/driverDashboard.component';
// import { OrgAdminDashboardComponent } from './orgadmin/orgadminDashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'admin',
      component: AdminDashboardComponent/*,
      canActivate: [AuthGuard]*/
    }/*, {
      path: 'manager',
      component: ManagerDashboardComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'orgadmin',
      component: OrgAdminDashboardComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'driver',
      component: DriverDashboardComponent,
      canActivate: [AuthGuard]
    }*/]
  }
];
