import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { PopoverModule } from 'ngx-popover';
import { QuillModule } from 'ngx-quill';

import { AuthGuard } from '../@core/user/auth.guard';
import { MaxValueDirective } from '../@core/validators/maxValue.directive';
import { SharedModule } from '../shared/shared.module';
import { AddJourneyComponent } from './addJourney.component';
import { JourneyDetailsComponent } from './journeyDetails.component';
import { JourneyDisplayComponent } from './journeydisplay.component';
import { JourneyEditComponent } from './journeyedit.component';
import { JourneysComponent } from './journeys.component';
import { JourneyDisplay } from '../@core/journeys/journeyDisplay.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faSignInAlt, faSignOutAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import {MapModule, MapAPILoader, MarkerTypeId, IMapOptions, IBox, IMarkerIconInfo, WindowRef,
    DocumentRef, MapServiceFactory,
    BingMapAPILoaderConfig, BingMapAPILoader,
    GoogleMapAPILoader,  GoogleMapAPILoaderConfig
} from 'angular-maps';

const routes: Routes = [
    { path: '', component: JourneysComponent, canActivate: [AuthGuard] },
    { path: 'details/:code', component: JourneyDetailsComponent, canActivate: [AuthGuard] }
];

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
        QuillModule,
        FontAwesomeModule,
        MapModule.forRootBing()
    ],
    declarations: [JourneysComponent, JourneyDetailsComponent,
        JourneyDisplayComponent, JourneyEditComponent,
        AddJourneyComponent, MaxValueDirective],
    providers: [
        {
            provide: MapAPILoader, deps: [], useFactory: BingMapServiceProviderFactory
        }
    ],
    entryComponents: [AddJourneyComponent]
})
export class JourneysModule { }

export function BingMapServiceProviderFactory() {
    const bc: BingMapAPILoaderConfig = new BingMapAPILoaderConfig();
    bc.apiKey = 'AmdpTGFUdqvAUl2EcTxyOwoBXiEaHHzvuWfFH-tJDNNgnFiQApuUvU11D-YjElTR';
      // replace with your bing map key
      // the usage of this key outside this plunker is illegal.
     bc.branch = '';
      // to use the experimental bing brach. There are some bug fixes for
      // clustering in that branch you will need if you want to use
      // clustering.
    return new BingMapAPILoader(bc, new WindowRef(), new DocumentRef());

}
