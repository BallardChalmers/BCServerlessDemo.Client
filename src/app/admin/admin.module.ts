import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChangeRecordService } from '../@core/changerecord/changerecord.service';
import { MetadataService } from '../@core/metadata/metadata.service';
import { AuthGuard } from '../@core/user/auth.guard';
import { PipeModule } from '../shared/pipes/pipe.module';
import { SharedModule } from '../shared/shared.module';
import { UserManagementComponent } from './userManagement/userManagement.component';

const routes: Routes = [
  /*{
    path: 'changerecords',
    component: ChangeRecordsComponent,
    canActivate: [AuthGuard]
  },*/
  {
    path: 'usermanagement',
    component: UserManagementComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    SharedModule,
    PipeModule,
  ],
  declarations: [UserManagementComponent],
  providers: [ChangeRecordService, MetadataService],
  entryComponents: [UserManagementComponent]
})
export class AdminModule { }
