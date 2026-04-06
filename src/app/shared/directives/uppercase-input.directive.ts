import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[uppercase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseInputDirective),
      multi: true,
    }
  ]
})
export class UppercaseInputDirective {

  lastValue?: string;

  constructor(public elementRef: ElementRef) { }

  // tslint:disable-next-line
  public onChange = (_: any) => { };
  public onTouch = () => { };

  private applyValueChanges(value: string): void {
    this.elementRef.nativeElement.value = (value || '').toUpperCase();
    this.onChange(value);
  }

  @HostListener('input', ['$event'])
  public onInput(e: KeyboardEvent): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this.applyValueChanges(el.value);
  }

  @HostListener('paste', ['$event'])
  public onPaste(e: any): void {
    const el: HTMLInputElement = e.target as HTMLInputElement;
    this.applyValueChanges(el.value);
  }

  /** It writes the value in the input */
  public async writeValue(inputValue: string): Promise<void> {
    if (inputValue === undefined) {
      inputValue = '';
    }

    this.applyValueChanges(inputValue);
  }

  // tslint:disable-next-line
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
