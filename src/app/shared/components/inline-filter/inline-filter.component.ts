import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterOption, SelectedOption } from './models';

@Component({
  selector: 'app-inline-filter',
  templateUrl: './inline-filter.component.html',
  styleUrls: ['./inline-filter.component.scss']
})
export class InlineFilterComponent implements OnInit {

  currentValues: SelectedOption[] = [];

  @Input() options: FilterOption[] = [];
  @Input() multiSelect = false;
  @Input() allowEmpty = false;

  @Input() title?: string;
  @Input() initialValue?: string;
  @Input() optionClass: string = "";
  @Output() filter = new EventEmitter<SelectedOption[]>();

  constructor() { }

  ngOnInit(): void {
    const option = this.options.find(d => d.key === this.initialValue);

    if (!!option) {
      setTimeout(() => this.selectOption(option), 500);
    }
  }

  selectOption(option: FilterOption) {
    if (this.multiSelect) {
      this.selectMany(option);
    } else {
      this.selectOne(option);
    }
  }

  selectMany(option: FilterOption): void {
    if (this.isSelected(option)) {
      if (this.allowEmpty || Array.from(this.currentValues).length > 1) {
        this.currentValues = this.currentValues.filter(i => i.name !== option.key);
      }
    } else {
      this.currentValues.push(option.select());
    }

    this.filter.emit(this.currentValues);
  }

  selectOne(option: FilterOption): void {
    if (this.isSelected(option)) {
      if (this.allowEmpty) {
        this.currentValues = []
      }
    } else {
      this.currentValues = [option.select()]
    }

    this.filter.emit(this.currentValues);
  }

  isSelected(option: FilterOption) {
    return (this.currentValues || []).some(i => i.name === option.key)
  }

}
