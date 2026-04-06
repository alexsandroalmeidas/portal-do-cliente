import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  CalendarEvent,
  CalendarMonthViewDay,
  CalendarView,
} from 'angular-calendar';
import { endOfDay, startOfDay } from 'date-fns';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { BasePage } from '../../base.page';
import {
  SalesStoreActions,
  SalesStoreSelectors,
} from './../../../../../root-store/sales-store';
import {
  SalesCalendar,
  SummarySales,
} from './../../../../../root-store/sales-store/sales.models';
import { AppState } from './../../../../../root-store/state';
import { SharedModule } from './../../../../../shared/shared.module';
import { NavigationService } from '@/shared/services/navigation.service';
import { NotificationService } from '@/shared/services/notification.service';

@Component({
  selector: 'app-calendar-vision-sales',
  templateUrl: './calendar-vision.component.html',
  styleUrls: ['./calendar-vision.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [SharedModule],
})
export class CalendarVisionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  view: CalendarView = CalendarView.Month;
  selectedMonthViewDay!: CalendarMonthViewDay;
  today: Date = new Date();
  selectedDays: any = [];
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];

  totalAmount: number = 0;
  totalCount: number = 0;

  summarySales: SummarySales[] = [];

  dateFormat!: string;
  sales: SalesCalendar[] = [];

  @Input() viewDate: Date = new Date();
  @Output() viewChange = new EventEmitter<CalendarView>();
  @Output() viewDateChange = new EventEmitter<Date>();

  getAmmountSaleDay(event: any) {
    return event?.title.split('#')[0];
  }

  getCountSaleDay(event: any) {
    const count = event?.title.split('#')[1];

    return count > 0 ? `${event?.title.split('#')[1]} venda(s)` : '';
  }

  constructor(
    store$: Store<AppState>,
    public dialog: MatDialog,
    navigationService: NavigationService,
    protected notificationService: NotificationService,
  ) {
    super(store$, navigationService);

    this.viewDateChange = new EventEmitter<Date>();
    this.viewChange = new EventEmitter<CalendarView>();
    this.viewDate = new Date();
  }

  ngOnInit(): void {
    this.subscribeSalesCalendarExcel();
    this.subscribeSalesCalendar();

    this.viewDateChange = new EventEmitter<Date>();
    this.viewChange = new EventEmitter<CalendarView>();
    this.viewDate = new Date();
  }

  private subscribeSalesCalendar() {
    this.store$
      .select(SalesStoreSelectors.selectSalesCalendar)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesCalendar) => {
        this.sales = (salesCalendar || [])?.filter((x) => !x.isCancelled);

        this.sumarizeAll(this.sales);
        this.loadEvents();
      });
  }

  private subscribeSalesCalendarExcel() {
    this.store$
      .select(SalesStoreSelectors.selectSalesCalendarExcel)
      .pipe(takeUntil(this.$unsub))
      .subscribe((data) => {
        if (!!data) {
          saveAs(data, 'Vendas_' + new Date().format('DDMMYYYYHHmmss'));
        }

        this.store$.dispatch(
          new SalesStoreActions.DownloadedSalesCalendarExcelAction(),
        );
      });
  }

  protected override onChangeSelectedEstablishments(): void {
    this.selectSalesCalendar();
  }

  private loadEvents() {
    const group = this.sales
      ?.filter(
        (s) => s.paymentStatus !== 'Negada' && s.paymentStatus !== 'Desfeita',
      )
      .groupBy((x) => `${x.yearMonthDay}`);

    const keys = Object.keys(group);

    const groupped = keys.map((key) => {
      const saleDate = new Date(
        group[key][0].year,
        group[key][0].month - 1,
        group[key][0].day,
      );

      return {
        amount: group[key].sumBy((s) => s.amount),
        date: saleDate,
        count: group[key].length,
        modality: '',
      };
    });

    this.events = [];

    groupped.forEach((g) => {
      this.events.push({
        start: startOfDay(g.date),
        end: endOfDay(g.date),
        title: `${g.amount} # ${g.count}`,
      });

      this.refresh.next(true);
    });
  }

  onChangePastYear(viewDate: any) {
    this.viewDate = new Date(moment(viewDate).subtract(1, 'year').format());
    this.selectSalesCalendar();
  }

  onChangeNextYear(viewDate: any) {
    this.viewDate = new Date(moment(viewDate).add(1, 'year').format());
    this.selectSalesCalendar();
  }

  sumarizeAll(sales: SalesCalendar[]) {
    this.summarySales = [];

    const salesWithoutDenied = sales?.filter(
      (s) => s.paymentStatus !== 'Negada' && s.paymentStatus !== 'Desfeita',
    );

    this.sumarizeTotal(salesWithoutDenied);
    this.sumarizeCredit(salesWithoutDenied);
    this.sumarizeInternationalCredit(salesWithoutDenied);
    this.sumarizeInstallments(salesWithoutDenied);
    this.sumarizePrepaidCredit(salesWithoutDenied);
    this.sumarizePrepaidDebit(salesWithoutDenied);
    this.sumarizeDebit(salesWithoutDenied);
    this.sumarizePix(salesWithoutDenied);
    this.sumarizeVoucher(salesWithoutDenied);
  }

  private sumarizeTotal(sales: SalesCalendar[]) {
    this.totalAmount = sales.sumBy((s) => s.amount) || 0;
    this.totalCount = sales.length;
  }

  private sumarizeDebit(sales: SalesCalendar[]) {
    const debits = sales.filter((c) => c.isDebit);

    if (!!debits && debits.some((x) => x.debitCount > 0)) {
      const amount = debits.sumBy((d) => d.debitAmount);
      const count = debits.sumBy((d) => d.debitCount);

      this.summarySales.push({
        label: 'Débito',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizePrepaidDebit(sales: SalesCalendar[]) {
    const prepaidDebits = sales.filter((c) => c.isPrepaidDebit);

    if (!!prepaidDebits && prepaidDebits.some((x) => x.prepaidDebitCount > 0)) {
      const amount = prepaidDebits.sumBy((d) => d.prepaidDebitAmount);
      const count = prepaidDebits.sumBy((d) => d.prepaidDebitCount);

      this.summarySales.push({
        label: 'Débito Pré-Pago',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizeCredit(sales: SalesCalendar[]) {
    const credits = sales.filter((c) => c.isCredit);

    if (!!credits && credits.some((x) => x.creditCount > 0)) {
      const amount = credits.sumBy((d) => d.creditAmount);
      const count = credits.sumBy((d) => d.creditCount);

      this.summarySales.push({
        label: 'Crédito à Vista',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizePrepaidCredit(sales: SalesCalendar[]) {
    const prepaidCredits = sales.filter((c) => c.isPrepaidCredit);

    if (
      !!prepaidCredits &&
      prepaidCredits.some((x) => x.prepaidCreditCount > 0)
    ) {
      const amount = prepaidCredits.sumBy((d) => d.prepaidCreditAmount);
      const count = prepaidCredits.sumBy((d) => d.prepaidCreditCount);

      this.summarySales.push({
        label: 'Crédito Pré-Pago',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizeInternationalCredit(sales: SalesCalendar[]) {
    const internationalCredits = sales.filter((c) => c.isInternationalCredit);

    if (
      !!internationalCredits &&
      internationalCredits.some((x) => x.internationalCreditCount > 0)
    ) {
      const amount = internationalCredits.sumBy(
        (d) => d.internationalCreditAmount,
      );
      const count = internationalCredits.sumBy(
        (d) => d.internationalCreditCount,
      );

      this.summarySales.push({
        label: 'Crédito Internacional',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizeVoucher(sales: SalesCalendar[]) {
    const vouchers = sales.filter((c) => c.isVoucher);

    if (!!vouchers && vouchers.some((x) => x.voucherCount > 0)) {
      const amount = vouchers.sumBy((d) => d.voucherAmount);
      const count = vouchers.sumBy((d) => d.voucherCount);

      this.summarySales.push({
        label: 'Voucher',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizeInstallments(sales: SalesCalendar[]) {
    const installments = sales.filter((c) => c.isInstallments);

    if (!!installments && installments.some((x) => x.installmentsCount > 0)) {
      const amount = installments.sumBy((d) => d.installmentsAmount);
      const count = installments.sumBy((d) => d.installmentsCount);

      this.summarySales.push({
        label: 'Parcelado 2 a 12x',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  private sumarizePix(sales: SalesCalendar[]) {
    const pixes = sales.filter((c) => c.isPix);

    if (!!pixes && pixes.some((x) => x.pixCount > 0)) {
      const amount = pixes.sumBy((d) => d.pixAmount);
      const count = pixes.sumBy((d) => d.pixCount);

      this.summarySales.push({
        label: 'Pix',
        count,
        countPercent: '0',
        amount,
        amountPercent: '0',
      });
    }
  }

  selectSalesCalendar() {
    this.selectedDays = [];
    this.events = [];

    if (!this.viewDate) {
      this.viewDate = new Date();
    }

    const firstDay = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      0,
    );

    const initialDate = `${firstDay}` || '';
    const finalDate = `${lastDay}` || '';

    this.store$.dispatch(
      new SalesStoreActions.SelectSalesCalendarAction({
        initialDate,
        finalDate,
        uids: this.selectedEstablishmentsUids,
      }),
    );
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      if (
        this.selectedDays.some(
          (selectedDay: { date: { getTime: () => number } }) =>
            selectedDay.date.getTime() === day.date.getTime(),
        )
      ) {
        day.cssClass = 'cal-day-selected';
      }
    });
  }

  dayClicked(day: CalendarMonthViewDay): void {
    this.selectedMonthViewDay = day;
    const selectedDateTime = this.selectedMonthViewDay.date.getTime();
    const dateIndex = this.selectedDays.findIndex(
      (selectedDay: { date: { getTime: () => number } }) =>
        selectedDay.date.getTime() === selectedDateTime,
    );
    if (dateIndex > -1) {
      delete this.selectedMonthViewDay.cssClass;
      this.selectedDays.splice(dateIndex, 1);
    } else {
      this.selectedDays.push(this.selectedMonthViewDay);
      day.cssClass = 'cal-day-selected';
      this.selectedMonthViewDay = day;
    }

    let sales = this.sales;

    if (!isEmpty(this.selectedDays)) {
      sales = this.sales.filter((x) =>
        this.selectedDays.some(
          (p: { date: { getDate: () => number } }) =>
            p.date.getDate() === x.day,
        ),
      );
    }

    this.sumarizeAll(sales);
  }

  onExport() {
    const dates: Date[] = [];

    if (!this.viewDate) {
      this.viewDate = new Date();
    }

    const firstDay = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      0,
    );

    const initialDate = `${firstDay}` || '';
    const finalDate = `${lastDay}` || '';

    if (!!this.selectedDays && this.selectedDays.length > 0)
      this.selectedDays.forEach((x: { date: Date }) => dates.push(x.date));

    this.store$.dispatch(
      new SalesStoreActions.SelectSalesCalendarExcelAction({
        initialDate,
        finalDate,
        uids: this.selectedEstablishmentsUids,
        dates,
      }),
    );
  }
}
