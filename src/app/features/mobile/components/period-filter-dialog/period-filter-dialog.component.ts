import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelFooterDirective } from '../sidenav-panel/sidenav-panel-footer.directive';
import { SidenavPanelHeaderDirective } from '../sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../sidenav-panel/sidenav-panel.component';

@Component({
  selector: 'app-period-filter-dialog',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelFooterDirective,
    SidenavPanelHeaderDirective,
  ],
  templateUrl: './period-filter-dialog.component.html',
  styleUrls: ['./period-filter-dialog.component.scss'],
})
export class PeriodFilterDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  selectedDateRange!: DateRange<Moment>;

  @Input() initialRange!: DateRange<Date>;
  @Input() maxDate!: Date;
  @Output() confirm = new EventEmitter<DateRange<Date>>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    this.selectedDateRange = new DateRange<Moment>(
      moment(this.initialRange.start),
      moment(this.initialRange.end),
    );
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onSelectedChange(date: Moment): void {
    const { start, end } = this.selectedDateRange ?? { start: null, end: null };

    if ((start && end) || (!start && !end)) {
      this.selectedDateRange = new DateRange(date, null);
      return;
    }

    if (start && date >= start && !end) {
      this.selectedDateRange = new DateRange(start, date);
    }
  }

  onCancel() {
    this.cancel.next();
  }

  onConfirm() {
    this.confirm.next(
      new DateRange<Date>(
        this.selectedDateRange.start?.toDate() ?? null,
        this.selectedDateRange.end?.toDate() ?? null,
      ),
    );
  }
}
