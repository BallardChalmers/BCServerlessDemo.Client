import {
    Component,
    OnInit,
    EventEmitter,
    Input,
    Output,
    AfterContentInit,
    AfterViewInit,
    ViewEncapsulation,
    Injectable,
    ViewChild,
    ElementRef
} from '@angular/core';
import { DatePipe } from '@angular/common';

import {NgbDateStruct, NgbDateParserFormatter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

import { PopoverContent } from 'ngx-popover';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
!one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
// End  range date picker


@Component({
    selector: 'shared-daterangepicker',
    templateUrl: './daterangepicker.component.html',
    styles: [`
    .dark-modal .modal-content {
      background-color: #009efb;
      color: white;
      width: 1000px;
    }
    .dark-modal .close {
      color: white;
    }
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: #0275d8;
      color: white;
    }
    .faded {
      opacity: 0.5;
    }
  `],
    encapsulation: ViewEncapsulation.None,
    providers: []
})

export class DateRangePickerComponent implements OnInit  {
    @Input() fromDate: Date;
    @Input() toDate: Date;
    @Input() headerText: string;
    @Input() profile: String;
    @Input() minDate: NgbDateStruct;
    @Input() maxDate: NgbDateStruct;
    @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dateRangePopover') dateRangePopover: PopoverContent;

    selectedDate: NgbDateStruct;
    hoveredDate: NgbDateStruct;
    calFromDate: NgbDateStruct;
    calToDate: NgbDateStruct;

    constructor(private calendar: NgbCalendar) {
    }

    ngOnInit(): void {
        const today = new Date();

        switch (this.profile) {
            case 'DoB':
                this.minDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 100 }
                this.maxDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 18 }
            case 'Certification':
                this.minDate = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() - 100 }
            default:
                break;
        }
    }

    onDateChange(date: NgbDateStruct) {
        if (!this.calFromDate && !this.calToDate) {
            this.calFromDate = date;
        } else if (this.calFromDate
            && !this.calToDate
            && after(date, this.calFromDate)) {
            this.calToDate = date;
            this.fromDate = new Date(this.calFromDate.year, this.calFromDate.month - 1, this.calFromDate.day);
            this.toDate = new Date(this.calToDate.year, this.calToDate.month - 1, this.calToDate.day);
            this.dateChanged.emit({'currentFromDate': this.fromDate, 'currentToDate': this.toDate});
        } else {
            this.calToDate = null;
            this.calFromDate = date;
        }

        if (this.fromDate && this.toDate) {
            this.dateRangePopover.hide();
        }
    }

    getFromDate(): Date {
        if (this.calFromDate == null) {
            return null;
        }

        return new Date(
            this.calFromDate.year,
            this.calFromDate.month - 1,
            this.calFromDate.day);
    }

    getToDate(): Date {
        if (this.calToDate == null) {
            return null;
        }

        return new Date(
            this.calToDate.year,
            this.calToDate.month - 1,
            this.calToDate.day);
    }

    isHovered = date => this.calFromDate && !this.calToDate && this.hoveredDate && after(date, this.calFromDate) && before(date, this.hoveredDate);
    isInside = date => after(date, this.calFromDate) && before(date, this.calToDate);
    isFrom = date => equals(date, this.calFromDate);
    isTo = date => equals(date, this.calToDate);
}
