import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AdminOverview } from '../../@core/dashboard/AdminOverview.model';
import { AdminOverviewService } from '../../@core/dashboard/AdminOverview.service';


@Component({
    templateUrl: './adminDashboard.component.html',
    styleUrls: ['./../dashboards.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
    overview = new AdminOverview();

    constructor(private AdminOverviewService: AdminOverviewService) {
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.AdminOverviewService.getOverview().subscribe(o => this.overview = o);


    }
}
