import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { PopoverModule } from 'ngx-popover';

import { AuthGuard } from '../@core/user/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { DriverComponent } from './drivers.component';
import { DriverDisplayComponent } from './driverdisplay.component';
import { DriverEditComponent } from './driveredit.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faSignInAlt, faSignOutAlt, faEdit } from '@fortawesome/free-solid-svg-icons';


const routes: Routes = [{ path: '', component: DriverComponent/*, canActivate: [AuthGuard] */}];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),
        NgbModalModule.forRoot(),
        NgbModule,
        SharedModule,
        FileUploadModule,
        PopoverModule,
        FontAwesomeModule
    ],
    declarations: [DriverComponent, DriverDisplayComponent, DriverEditComponent],
    providers: [],
    entryComponents: []
})
export class DriversModule { }
