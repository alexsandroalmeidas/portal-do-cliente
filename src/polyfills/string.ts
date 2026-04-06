import moment from 'moment';

export {};

declare global {
  interface String {
    format(...replacements: string[]): string;
    isValidDate(): boolean;
    toDate(format?: string): Date | null;
    removeDiacritics(): string;
    capitalize(): string;
    toDateString(): string;
  }
}

String.prototype.toDate = function (format?: string): Date | null {
  if (!this) {
    return null;
  }

  const _this = `${this}`;
  const pattern =
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

  if (!pattern.test(_this) && _this.isValidDate()) {
    return new Date(_this);
  }

  const _moment = moment(_this, format);

  if (_moment.isValid()) {
    return _moment.toDate();
  }

  return null;
};

String.prototype.isValidDate = function () {
  const date = new Date(`${this}`);
  return moment(date).isValid();
};

String.prototype.format = function () {
  const args = arguments;
  const sprintfRegex = /\{(\d+)\}/g;

  const sprintf = (match: any, num: number) => {
    return num in args ? args[num] : match;
  };

  return this.replace(sprintfRegex, sprintf);
};

String.prototype.removeDiacritics = function () {
  const value = this;

  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

String.prototype.capitalize = function () {
  if (!this) {
    return this;
  }

  return `${this[0].toUpperCase()}${this.substr(1).toLowerCase()}`;
};

String.prototype.toDateString = function () {
  if (!this) {
    return this;
  }

  return this.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
};
