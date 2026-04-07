import { DateRange } from '@angular/material/datepicker';

export type SalesPeriod = 'today' | 'lastWeek' | 'lastMonth' | 'custom';
export type ReceivablesPeriod = 'today' | 'nextWeek' | 'nextMonth' | 'custom';
export type PrepaymentsPeriod = 'today' | 'lastWeek' | 'lastMonth' | 'last3Months' | 'lastYear' | 'custom';

export class PrepaymentsPeriodFilter {
  range: DateRange<Date>;

  constructor(public period: PrepaymentsPeriod, range?: DateRange<Date>) {
    this.range = this.defineDateRange(period, range);
  }

  private defineDateRange(period: PrepaymentsPeriod, range?: DateRange<Date>): DateRange<Date> {
    if (period === 'custom') {
      if (!range) {
        throw new Error('Invalid date range');
      }

      return range;
    }

    const today = new Date().date();
    let start = today;
    let end = today.addDays(1).addSeconds(-1);

    start = this.ChangeStartDate(period, start, end);

    return new DateRange<Date>(start, end);
  }

  private ChangeStartDate(period: string, start: Date, end: Date) {
    if (period === 'lastWeek') {
      start = end.addDays(-7);
    } else if (period === 'lastMonth') {
      start = end.addDays(-30);
    } else if (period === 'last3Months') {
      start = end.addDays(-90);
    } else if (period === 'lastYear') {
      start = end.addDays(-365);
    }
    return start;
  }
}

export class SalesPeriodFilter {
  range: DateRange<Date>;

  constructor(public period: SalesPeriod, range?: DateRange<Date>) {
    this.range = this.defineDateRange(period, range);
  }

  private defineDateRange(period: SalesPeriod, range?: DateRange<Date>): DateRange<Date> {
    if (period === 'custom') {
      if (!range) {
        throw new Error('Invalid date range');
      }

      return range;
    }

    const today = new Date().date();
    let start = today;
    let end = today.addDays(1).addSeconds(-1);

    if (period === 'lastWeek') {
      start = end.addDays(-7);

    } else if (period === 'lastMonth') {
      start = end.addDays(-30);
    }

    return new DateRange<Date>(start, end);
  }
}

export class ReceivablesPeriodFilter {
  range: DateRange<Date>;

  constructor(public period: ReceivablesPeriod, range?: DateRange<Date>) {
    this.range = this.defineDateRange(period, range);
  }

  private defineDateRange(period: ReceivablesPeriod, range?: DateRange<Date>): DateRange<Date> {
    if (period === 'custom') {
      if (!range) {
        throw new Error('Invalid date range');
      }

      return range;
    }

    const today = new Date().date();
    let start = today;
    let end = today.addDays(1).addSeconds(-1);

    if (period === 'nextWeek') {
      end = end.addDays(7);

    } else if (period === 'nextMonth') {
      end = end.addDays(30);
    }

    return new DateRange<Date>(start, end);
  }
}

export const SalesPeriodFilterOptions: { [key: string]: string } = {
  'today': 'Hoje',
  'lastWeek': 'Últimos 7 dias',
  'lastMonth': 'Últimos 30 dias'
};

export const ReceivablesPeriodFilterOptions: { [key: string]: string } = {
  'today': 'Hoje',
  'nextWeek': 'Próximos 7 dias',
  'nextMonth': 'Próximos 30 dias',
};
