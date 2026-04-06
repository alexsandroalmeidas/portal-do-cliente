import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { EnumEntry } from '../../extras/enum-helper';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit, OnDestroy, OnChanges {

  private $unsub = new Subject();

  @Input() title = '';
  @Input() entryClass = '';
  @Input() entries: EnumEntry[] = [];
  @Input() initialValue?: string;

  @Output() changeValue = new EventEmitter<EnumEntry>();

  selectedEntry?: EnumEntry;

  constructor(public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    const entry = this.entries.find(d => d.key === this.initialValue);

    if (!!entry) {
      setTimeout(() => this.selectedEntry = entry, 500);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!!changes['entries']?.currentValue) {
      const entries = Array.from<EnumEntry>(changes['entries']?.currentValue);

      if (!!entries.length) {
        this.selectedEntry = entries[0];
      }
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onEntryChange(entry: EnumEntry) {
    this.selectedEntry = entry;
    this.changeValue.emit(entry);
  }
}
