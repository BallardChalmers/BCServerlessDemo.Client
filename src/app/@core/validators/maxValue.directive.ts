import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[maxValue]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValueDirective, multi: true }]
})
export class MaxValueDirective implements Validator {
  @Input('maxValue') maxValue: number;

  validate(control: AbstractControl): { [key: string]: any } {
    return this.maxValue != null ? this.maxValueValidator(this.maxValue)(control) : null;
  }

  maxValueValidator(maxValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const invalid = control.value > maxValue;

      return invalid ? { 'maxValue': { value: control.value } } : null;
    };
  }
}
