import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayLimit',
})
export class DisplayLimitPipe implements PipeTransform {
  transform(value: number, limit: number): string {
    if (isNaN(value) || isNaN(limit) || value <= limit) {
      return `${value}`;
    }

    return `${limit}+`;
  }
}
