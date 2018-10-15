import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            /*{ path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthGuard] },*/
            { path: 'dashboard', loadChildren: './dashboards/dashboard.module#DashboardModule' },
            { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
            { path: 'journeys', loadChildren: './journeys/journeys.module#JourneysModule' },
            // { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
            { path: 'organisations', loadChildren: './organisations/organisations.module#OrganisationsModule' },
            { path: 'drivers', loadChildren: './drivers/drivers.module#DriversModule' },
            // { path: 'audit', loadChildren: './audits/audits.module#AuditsModule' },
            // { path: 'approvals', loadChildren: './approvals/approvals.module#ApprovalsModule' },
            { path: 'auth', loadChildren: './shared/authentication/authentication.module#AuthenticationModule' }
        ]
    },
    {
        path: '',
        component: BlankComponent,
        children: [
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            {
                path: '.auth',
                loadChildren: './shared/authentication/authentication.module#AuthenticationModule'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }];

@NgModule({
    imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
    exports: [RouterModule]
})
export class AppRoutingModule { }

