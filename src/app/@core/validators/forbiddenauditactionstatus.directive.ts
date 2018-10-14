import { Directive, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from "@angular/forms";
import { AuditActionStatus } from "../enum";

@Directive({
    selector: '[forbiddenAuditActionStatus]',
    providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenAuditActionStatusDirective, multi: true}]
  })
  export class ForbiddenAuditActionStatusDirective implements Validator {
    @Input('forbiddenAuditActionStatus') forbiddenAuditActionStatus: AuditActionStatus;

    validate(control: AbstractControl): {[key: string]: any} {
      return this.forbiddenAuditActionStatus != null ? this.forbiddenStatusValidator(this.forbiddenAuditActionStatus)(control): null;
    }

    forbiddenStatusValidator(forbiddenStatus: AuditActionStatus): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        const forbidden = control.value == forbiddenStatus;

        return forbidden ? {'forbiddenAuditActionStatus': {value: control.value}} : null;
      };
    }
  }