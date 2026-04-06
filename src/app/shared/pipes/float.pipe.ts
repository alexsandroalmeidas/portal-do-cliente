import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'float',
})
export class FloatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    const options = { maximumSignificantDigits: 2 };
    return value.toLocaleString(undefined, options);
  }

  // transform(value: number): string {

  //   if (value > 1e10) {
  //     return value.toPrecision(3);
  //   } else {
  //     return `${this.decimalPipe.transform(value, '1.2-2')}`;
  //   }
  // }
}
