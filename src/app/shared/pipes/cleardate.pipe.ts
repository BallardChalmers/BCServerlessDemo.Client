import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'cleardate'
})
export class ClearDatePipe implements PipeTransform {
  transform(val, args) {
    if (val) {
        const date = new Date(val);

        if (date > new Date('0001-01-01T00:00:00')) {
            let datePipe = new DatePipe('en_GB');

            return datePipe.transform(date, args);
        }
    }

    return null;
  }
}


