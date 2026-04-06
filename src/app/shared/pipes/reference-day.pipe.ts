import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referenceDay',
  pure: true,
})
export class ReferenceDayPipe implements PipeTransform {
  transform(value: Date | string): any {
    if (value) {
      const date = value instanceof Date ? value : Date.fromString(value);

      const today = new Date().date();

      if (date.isSame(today)) {
        return 'Hoje';
      }

      if (date.isSame(today.addDays(-1))) {
        return 'Ontem';
      }

      if (date.isSame(today.addDays(1))) {
        return 'Amanhã';
      }

      return '';
    }

    return '';
  }
}
