import moment from 'moment';

export {};

declare global {
  interface Date {
    addYears(years: number): Date;
    addMonths(months: number): Date;
    addWeeks(weeks: number): Date;
    addDays(days: number): Date;
    addSeconds(seconds: number): Date;
    date(): Date;
    isToday(): boolean;
    clone(): Date;
    isWeekend(): boolean;
    isSame(date: Date): boolean;
    isBefore(date: Date): boolean;
    isBefore(date: Date): boolean;
    isBetween(from: Date, to: Date): boolean;
    isAfter(date: Date): boolean;
    isSameOrBefore(date: Date): boolean;
    isSameOrAfter(date: Date): boolean;
    format(format?: string): string;
    valid(): boolean;
    diff(from: Date, unitOfTime?: diff, precise?: boolean): number;
  }

  interface DateConstructor {
    fromString(value?: string, format?: string): Date;
  }

  type diff =
    | 'year'
    | 'years'
    | 'y'
    | 'month'
    | 'months'
    | 'M'
    | 'week'
    | 'weeks'
    | 'w'
    | 'day'
    | 'days'
    | 'd'
    | 'hour'
    | 'hours'
    | 'h'
    | 'minute'
    | 'minutes'
    | 'm'
    | 'second'
    | 'seconds'
    | 's'
    | 'millisecond'
    | 'milliseconds'
    | 'ms'
    | 'quarter'
    | 'quarters'
    | 'Q';
}

Date.prototype.format = function (format?: string): string {
  const _moment = moment(this);

  if (format) {
    return _moment.format(format);
  }

  return _moment.format();
};

Date.prototype.valid = function (): boolean {
  if (!this) {
    return false;
  }

  return moment(this).isValid();
};

Date.prototype.addYears = function (years: number): Date {
  if (!years) {
    return this;
  }

  return moment(this).add(years, 'y').toDate();
};

Date.prototype.addMonths = function (months: number): Date {
  if (!months) {
    return this;
  }

  return moment(this).add(months, 'M').toDate();
};

Date.prototype.addDays = function (days: number): Date {
  if (!days) {
    return this;
  }

  return moment(this).add(days, 'd').toDate();
};

Date.prototype.addWeeks = function (weeks: number): Date {
  if (!weeks) {
    return this;
  }

  return moment(this).add(weeks, 'w').toDate();
};

Date.prototype.addSeconds = function (seconds: number): Date {
  if (!seconds) {
    return this;
  }

  return moment(this).add(seconds, 's').toDate();
};

Date.prototype.date = function (): Date {
  const date = this;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

Date.prototype.isToday = function (): boolean {
  const today = new Date().date();
  return this.date().isSame(today);
};

Date.prototype.clone = function (): Date {
  return new Date(+this);
};

Date.prototype.isWeekend = function (): boolean {
  return this.getDay() === 0 || this.getDay() === 6;
};

Date.prototype.isSame = function (date: Date): boolean {
  return moment(this).isSame(moment(date));
};

Date.prototype.isBefore = function (date: Date): boolean {
  return moment(this).isBefore(moment(date));
};

Date.prototype.isBetween = function (from: Date, to: Date): boolean {
  return moment(this).isBetween(moment(from), moment(to));
};

Date.prototype.isAfter = function (date: Date): boolean {
  return moment(this).isAfter(moment(date));
};

Date.prototype.isSameOrBefore = function (date: Date): boolean {
  return moment(this).isSameOrBefore(moment(date));
};

Date.prototype.isSameOrAfter = function (date: Date): boolean {
  return moment(this).isSameOrAfter(moment(date));
};

Date.prototype.diff = function (
  from: Date,
  unitOfTime?: diff,
  precise?: boolean,
): number {
  return moment(this).diff(from, unitOfTime, precise);
};

Date.fromString = function (value?: string, format?: string) {
  try {
    if (!value) {
      throw Error('Invalid date value');
    }

    const _moment = moment(value, format, true);

    if (_moment.isValid()) {
      return _moment.toDate();
    }

    throw Error('Invalid date format');
  } catch (err) {
    throw Error('Invalid date format');
  }
};
