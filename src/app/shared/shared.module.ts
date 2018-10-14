import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { PopoverModule } from 'ngx-popover';

import { ConfirmModalComponent } from './confirmModal/confirmModal.component';
import { DatePickerComponent } from './datepicker/datepicker.component';
import { DateRangePickerComponent } from './dateRangePicker/dateRangePicker.component';
import { DisplayBoolComponent } from './displayBool/displayBool.component';
import { InlineSearchComponent } from './inlinesearch/inlinesearch.component';
import { PipeModule } from './pipes/pipe.module';
import { RagStatusComponent } from './ragstatus/ragstatus.component';
import { SummaryComponent } from './summary/summary.component';
import { ViewportComponent } from './viewport/viewport.component';

@NgModule({
    imports: [NgbModule, CommonModule, FormsModule, PopoverModule, FileUploadModule, RouterModule, PipeModule],
    declarations: [RagStatusComponent, SummaryComponent, ViewportComponent, DatePickerComponent,
        InlineSearchComponent, DateRangePickerComponent,
        DisplayBoolComponent, ConfirmModalComponent],
    exports: [RagStatusComponent, SummaryComponent, ViewportComponent, DatePickerComponent, InlineSearchComponent, DateRangePickerComponent,
        DisplayBoolComponent, ConfirmModalComponent],
    entryComponents: [ConfirmModalComponent],
    providers: []
})
export class SharedModule { }
