import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeRoutes } from './home.routing';
@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        RouterModule.forChild(HomeRoutes)
    ],
    declarations: [
        HomeComponent,
    ]
})
export class HomeModule { }
