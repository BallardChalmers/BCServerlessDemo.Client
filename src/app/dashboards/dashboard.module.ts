import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminOverviewService } from '../@core/dashboard/AdminOverview.service';
import { PipeModule } from '../shared/pipes/pipe.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutes } from './dashboard.routing';
import { AdminDashboardComponent } from './admin/adminDashboard.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        NgbModule,
        SharedModule,
        PipeModule
    ],
    declarations: [
        AdminDashboardComponent
    ],
    providers: [AdminOverviewService]
})
export class DashboardModule { }
