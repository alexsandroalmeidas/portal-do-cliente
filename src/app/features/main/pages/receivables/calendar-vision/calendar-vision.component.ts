import { AdministrationStoreSelectors } from '@/root-store/administration-store';
import { NavigationService } from '@/shared/services/navigation.service';
import { NotificationService } from '@/shared/services/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { CalendarComponent } from '../../../components/calendar/calendar.component';
import { CalendarEvent as CEvent } from '../../../components/calendar/calendar.models';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { BasePage } from '../../base.page';
import {
  ReceivablesStoreActions,
  ReceivablesStoreSelectors,
} from './../../../../../root-store/receivables-store';
import {
  Adjustment,
  ReceivableCalendar,
  ReceivableCalendarAdjustment,
} from './../../../../../root-store/receivables-store/receivables.models';
import { AppState } from './../../../../../root-store/state';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-calendar-vision-receivables',
  templateUrl: './calendar-vision.component.html',
  styleUrls: ['./calendar-vision.component.scss'],
  standalone: true,
  imports: [SharedModule, CalendarComponent, TooltipComponent],
})
export class CalendarVisionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  selectedDays: any = [];
  refresh: Subject<any> = new Subject();

  receivables: ReceivableCalendar[] = [];
  adjustments: Adjustment[] = [];
  bank = '';
  agency = '';
  account = '';

  totalAmount: number = 0;
  receivablesCreditAmount: number = 0;
  receivablesPrepaymentAmount: number = 0;
  adjustmentsCreditAmount: number = 0;
  adjustmentsDebitAmount: number = 0;

  adjustmentsCredits: ReceivableCalendarAdjustment[] = [];
  adjustmentsDebits: ReceivableCalendarAdjustment[] = [];

  oneDaySelected = false;
  situation = '';

  currentDate: Date = new Date();
  lastUpdateDate!: Date;
  startMonth: number = new Date().getMonth();
  startYear: number = new Date().getFullYear();
  myEvents: CEvent[] = [];

  reserve: number = 0;

  constructor(
    store$: Store<AppState>,
    public dialog: MatDialog,
    navigationService: NavigationService,
    protected notificationService: NotificationService,
  ) {
    super(store$, navigationService);
  }

  ngOnInit(): void {
    this.subscribeReceivablesCalendarExcel();
    this.subscribeReceivablesCalendar();
    this.subscribeLastUpdateDateReceivable();
    this.subscribeEconomicGroupReserve();
  }

  private subscribeEconomicGroupReserve() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupReserve)
      .pipe(takeUntil(this.$unsub))
      .subscribe((result) => {
        this.reserve = result?.reserve || 0;
      });
  }

  private subscribeLastUpdateDateReceivable() {
    this.store$
      .select(ReceivablesStoreSelectors.selectLastUpdateDateReceivables)
      .pipe(takeUntil(this.$unsub))
      .subscribe((last) => {
        if (!!last) this.lastUpdateDate = last.lastUpdateDate;
      });
  }

  private subscribeReceivablesCalendar() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesCalendar)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesCalendar) => {
        this.receivables = receivablesCalendar || [];
        this.loadEvents();
        this.sumarizeAll(this.receivables);
      });
  }

  private subscribeReceivablesCalendarExcel() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesCalendarExcel)
      .pipe(takeUntil(this.$unsub))
      .subscribe((data) => {
        if (!!data) {
          saveAs(data, 'Recebimentos_' + new Date().format('DDMMYYYYHHmmss'));
        }

        this.store$.dispatch(
          new ReceivablesStoreActions.DownloadedReceivablesCalendarExcelAction(),
        );
      });
  }

  protected override onChangeSelectedEstablishments(): void {
    this.selectReceivablesCalendar();
  }

  private loadEvents() {
    this.myEvents = [];

    this.receivables
      .filter((x) => x.sortingDate !== null && !x.isAdjust)
      .forEach((g) => {
        const parts = `${g.year}-${g.month}-${g.day}`.split('-');
        const date = new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2]),
        );

        const event: CEvent = {
          date,
          label: g.paymentStatus,
          amount: g.amount,
          status: g.paymentStatus.toLocaleLowerCase(),
        };

        this.myEvents.push(event);

        this.refresh.next(true);
      });
  }

  outCurrentDate(event: Date) {
    this.currentDate = event;
    this.selectReceivablesCalendar();
  }

  sumarizeAll(receivables: ReceivableCalendar[]) {
    this.totalAmount = receivables?.sumBy((s) => s.amount) || 0;
    this.receivablesPrepaymentAmount = receivables.sumBy(
      (d) => d.receivablesPrepaymentAmount,
    );
    this.receivablesCreditAmount = receivables.sumBy(
      (d) => d.receivablesCreditAmount,
    );

    this.sumarizeAdjustments(receivables);
  }

  private sumarizeAdjustments(receivables: ReceivableCalendar[]) {
    const adjustmentsCredits: ReceivableCalendarAdjustment[] = [];

    receivables.forEach((receivable) => {
      receivable.adjustmentsCredits.forEach((adj) =>
        adjustmentsCredits.push(adj),
      );
    });

    const adjustmentsDebits: ReceivableCalendarAdjustment[] = [];

    receivables.forEach((receivable) => {
      receivable.adjustmentsDebits.forEach((adj) =>
        adjustmentsDebits.push(adj),
      );
    });

    this.adjustmentsCreditAmount = adjustmentsCredits.sumBy((p) => p.amount);
    this.adjustmentsDebitAmount = adjustmentsDebits.sumBy((p) => p.amount);

    this.groupingAdjustments(adjustmentsCredits, adjustmentsDebits);
  }

  private groupingAdjustments(
    adjustmentsCredits: ReceivableCalendarAdjustment[],
    adjustmentsDebits: ReceivableCalendarAdjustment[],
  ) {
    const groupCredits = adjustmentsCredits.groupBy((p) => p.description);

    this.adjustmentsCredits = Object.keys(groupCredits).map((key) => {
      return {
        description: key,
        amount: groupCredits[key].sumBy((d) => d.amount),
      };
    });

    const groupDebits = adjustmentsDebits.groupBy((p) => p.description);

    this.adjustmentsDebits = Object.keys(groupDebits).map((key) => {
      return {
        description: key,
        amount: groupDebits[key].sumBy((d) => d.amount),
      };
    });
  }

  selectReceivablesCalendar() {
    this.selectedDays = [];

    if (!this.currentDate) {
      this.currentDate = new Date();
    }

    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1,
    );

    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0,
    );

    const initialDate = `${firstDay}` || '';
    const finalDate = `${lastDay}` || '';

    debugger;
    this.store$.dispatch(
      new ReceivablesStoreActions.SelectReceivablesCalendarAction({
        initialDate,
        finalDate,
        uids: this.selectedEstablishmentsUids,
      }),
    );
  }

  toYMD(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  dayClicked(event: any): void {
    this.selectedDays = event;

    let receivablesView = this.receivables.filter((x) => !x.isAdjust);

    if (!isEmpty(this.selectedDays)) {
      receivablesView = this.receivables.filter((x) => {
        const normalizedDate = this.toYMD(
          new Date(x.paymentDate ?? new Date()),
        );
        return this.selectedDays.has(normalizedDate);
      });
    }

    this.oneDaySelected =
      !isEmpty(this.selectedDays) &&
      this.selectedDays.length === 1 &&
      receivablesView.some((x) => !!x.paymentStatus);

    if (this.oneDaySelected) {
      const selectedDay = this.selectedDays[0].date.getDate();
      this.situation = '';
      let hasReceivableFiltered = receivablesView
        .filter((p) => p.day === selectedDay)
        .every((val, i, arr) => val.paymentStatus === arr[0].paymentStatus);

      if (!!hasReceivableFiltered)
        receivablesView.map((x) => (this.situation = x.paymentStatus));
    }

    this.sumarizeAll(receivablesView);
  }

  onExport() {
    const dates: Date[] = [];

    if (!this.currentDate) {
      this.currentDate = new Date();
    }

    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0,
    );

    const initialDate = `${firstDay}` || '';
    const finalDate = `${lastDay}` || '';

    if (this.selectedDays && this.selectedDays.size > 0) {
      this.selectedDays.forEach((dateStr: string) => {
        dates.push(new Date(dateStr));
      });
    }

    this.store$.dispatch(
      new ReceivablesStoreActions.SelectReceivablesCalendarExcelAction({
        initialDate,
        finalDate,
        uids: this.selectedEstablishmentsUids,
        dates,
      }),
    );
  }
}
