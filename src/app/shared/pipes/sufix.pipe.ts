import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sufix',
})
export class SufixPipe implements PipeTransform {
  transform(value: any, sufix: string): any {
    return `${value}${sufix}`;
  }
}
