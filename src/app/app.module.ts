import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PopoverModule } from 'ngx-popover';

import { JourneyService } from './@core/journeys/journey.service';
import { FilterStateService } from './@core/filter/filterstate.service';
import { OrganisationService } from './@core/organisations/organisation.service';
import { GridQueryStateService } from './@core/search/gridquerystateservice.service';
import { DriverService } from './@core/drivers/driver.service';
import { AuthGuard } from './@core/user/auth.guard';
import { AuthenticationHttpInterceptor } from './@core/user/authentication.httpInterceptor';
import { MsalService } from './@core/user/msal.service';
import { RoleCheck } from './@core/user/roleCheck.service';
import { UserManagementService } from './@core/user/userManagement.service';
import { CacheBusterHttpInterceptor } from './@core/utilities/cacheBusterHttpInterceptor';
import { LogService } from './@core/utilities/log.service';
import { SpinnerHttpInterceptor } from './@core/utilities/spinnerHttpInterceptor';
import { StartupService } from './@core/utilities/startup.service';
import { AppRoutingModule } from './app-routing.module';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { PipeModule } from './shared/pipes/pipe.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faSignInAlt, faSignOutAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
// or
// import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

library.add(faUser, faSignInAlt, faSignOutAlt, faEdit);

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    PopoverModule,
    PipeModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      // useClass: HashLocationStrategy
      useClass: PathLocationStrategy
    },
    LogService,
    AuthGuard,
    RoleCheck,
    UserManagementService,
    MsalService,
    StartupService,
    JourneyService,
    OrganisationService,
    DriverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheBusterHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerHttpInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => () => startupService.getLookups(),
      deps: [StartupService],
      multi: true
    },
    FilterStateService,
    GridQueryStateService],
  bootstrap: [AppComponent],
})
export class AppModule { }
