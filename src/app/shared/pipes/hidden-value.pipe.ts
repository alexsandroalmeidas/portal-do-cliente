import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hiddenValue',
})
export class HiddenValuePipe implements PipeTransform {
  transform(value: any, replaceChar: string = '*', count: number = 0): string {
    const len = count ?? `${value}`.length;
    return replaceChar.repeat(len);
  }
}
