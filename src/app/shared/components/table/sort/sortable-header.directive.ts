import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { SortDirection } from './sort-direction';
import { SortEvent } from './sort-event';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[sortable]',
  exportAs: 'sortable',
  host: { 'class': 'sortable' },
})
export class SortableHeaderDirective {

  @Input() sortable = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostBinding('class.asc')
  get asc() {
    return this.direction === 'asc';
  }

  @HostBinding('class.desc')
  get desc() {
    return this.direction === 'desc';
  }

  @HostListener('click')
  onSortBtnClick() {
    this.rotate();
  }

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}




