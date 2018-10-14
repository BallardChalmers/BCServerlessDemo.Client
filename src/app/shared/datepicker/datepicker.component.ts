import { AfterViewInit, Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return '';
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

@Injectable()
export class NgbDateENParserFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null };
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        let stringDate = '';
        if (date) {
            stringDate += isNumber(date.day) ? padNumber(date.day) + '/' : '';
            stringDate += isNumber(date.month) ? padNumber(date.month) + '/' : '';
            stringDate += date.year;
        }
        return stringDate;
    }
}

@Component({
    selector: 'shared-datepicker',
    templateUrl: './datepicker.component.html',
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateENParserFormatter }]
})

export class DatePickerComponent implements OnInit, AfterViewInit {
    @Input() dateValue: Date;
    @Input() required: Boolean;
    @Input() profile: String;
    @Input() minDate: NgbDateStruct;
    @Input() maxDate: NgbDateStruct;
    @Input() smallDisplay = false;
    @Output() dateChanged: EventEmitter<Date> = new EventEmitter<Date>();

    model: NgbDateStruct;

    constructor() {
    }

    ngOnInit(): void {
        const localDate = new Date(this.dateValue); // TODO: figure this out.
        this.model = { day: localDate.getUTCDate(), month: localDate.getUTCMonth() + 1, year: localDate.getUTCFullYear() };

        const today = new Date();

        switch (this.profile) {
            case 'DoB':
                this.minDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 100 };
                this.maxDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 18 };
                break;
            case 'Certfication':
                this.minDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 100 };
                break;
            default:
                break;
        }
    }

    onChange(date: NgbDateStruct) {
        if (date && date.year) {
            const newDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
            this.dateChanged.emit(newDate);
        } else {
            this.dateChanged.emit(null);
        }
    }

    ngAfterViewInit(): void {
    }
}
