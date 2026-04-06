import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FilterSelection } from './models';

const LABEL_DETAIL = 'detail';
const LABEL_CALENDAR = 'calendar';

@Component({
  selector: 'app-view-by-filter',
  templateUrl: './view-by-filter.component.html',
  styleUrls: ['./view-by-filter.component.scss']
})
export class ViewByFilterComponent implements OnInit, OnChanges {

  currentValue!: FilterSelection;
  lastValue!: FilterSelection;
  bsModalRef!: BsModalRef;

  @Input() initialValue!: FilterSelection;
  @Output() changeValue = new EventEmitter<FilterSelection>();

  ngOnInit(): void {
    switch (this.initialValue) {
      case LABEL_DETAIL:
        this.selectDetail();
        break;

      case LABEL_CALENDAR:
        this.selectCalendar();
        break;

      default:
        break;
    }
  }

  selectDetail() {
    this.lastValue = this.currentValue;
    if (this.currentValue !== LABEL_DETAIL) {
      this.currentValue = LABEL_DETAIL;
    }

    this.changeValue.emit(this.currentValue);
  }

  selectCalendar() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== LABEL_CALENDAR) {
      this.currentValue = LABEL_CALENDAR;
    }

    this.changeValue.emit(this.currentValue);
  }

  ngOnChanges() {
  }
}
