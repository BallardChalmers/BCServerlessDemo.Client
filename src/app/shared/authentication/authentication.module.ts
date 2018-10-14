import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MsalService } from '../../@core/user/msal.service';
import { NotFoundComponent } from './404/not-found.component';
import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes)
  ],
  declarations: [
    NotFoundComponent,
    LoginComponent,
    SignupComponent
  ],
  providers: [
    MsalService
  ]
})

export class AuthenticationModule { }
