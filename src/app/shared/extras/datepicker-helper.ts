import { Injectable } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Injectable()
export class DatePickerHelper {

}

export function getDatepickerConfig(): BsDatepickerConfig {

  return Object.assign(new BsDatepickerConfig(), {

    containerClass: 'custom-dt-picker',
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    selectWeek: false,
    minMode: 'day',
    selectFromOtherMonth: true,
  });
}
