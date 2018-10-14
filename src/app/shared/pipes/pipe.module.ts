import { NgModule } from '@angular/core';
import { ClearDatePipe } from './cleardate.pipe';
import { YesNoPipe } from './yesno.pipe';

@NgModule({
    imports: [],
    declarations: [ClearDatePipe, YesNoPipe],
    exports: [ClearDatePipe, YesNoPipe]
})
export class PipeModule {
    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}