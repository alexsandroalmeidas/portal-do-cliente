import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateRange } from '../models/date';

const datePipe = new DatePipe('pt-Br');

@Pipe({
  name: 'dateRange',
  pure: false,
})
export class DateRangePipe implements PipeTransform {
  transform(range: DateRange, format: string = 'dd/MM/yyyy'): string {
    if (!range) {
      return '';
    }

    if (range.from.isSame(range.to)) {
      return `${datePipe.transform(range.from, format)}`;
    }

    return `${datePipe.transform(range.from, format)} - ${datePipe.transform(range.to, format)}`;
  }
}
