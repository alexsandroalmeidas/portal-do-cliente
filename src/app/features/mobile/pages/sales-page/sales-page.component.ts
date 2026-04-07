import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DateRange } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import { InputFilterDialogComponent } from '../../components/input-filter-dialog/input-filter-dialog.component';
import { OptionsFilterDialogComponent } from '../../components/options-filter-dialog/options-filter-dialog.component';
import { PeriodFilterDialogComponent } from '../../components/period-filter-dialog/period-filter-dialog.component';
import { TimerFilterDialogComponent } from '../../components/timer-filter-dialog/timer-filter-dialog.component';
import { SalesPeriodFilter } from '../../models/period-filter';
import { SalesStoreActions, SalesStoreSelectors } from './../../../../root-store/sales-store';
import { SalesCalendar, SalesDetail, SalesDetailFiltersOptions } from './../../../../root-store/sales-store/sales.models';
import { AppState } from './../../../../root-store/state';
import { NavigationService } from './../../../../shared/services/navigation.service';
import { SharedModule } from './../../../../shared/shared.module';
import { SalesDetailsDialogComponent } from './../../components/sales-details-dialog/sales-details-dialog.component';
import { ToolbarBackgroundComponent } from './../../components/toolbar-background/toolbar-background.component';
import { SalesCardValues } from './../../models/sales-card-values';
import { SidenavService } from './../../services/sidenav.service';
import { ToolbarService } from './../../services/toolbar.service';
import { MobileBasePage } from './../mobile-base.page';
import { DailyViewComponent } from './components/daily-view/daily-view.component';
import { SaleDetailDialogComponent } from './components/sale-detail-dialog/sale-detail-dialog.component';
import { WeeklyViewComponent } from './components/weekly-view/weekly-view.component';

export type SalesViewMode = 'daily' | 'weekly';

@Component({
  standalone: true,
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.scss'],
  imports: [
    SharedModule,
    PeriodFilterDialogComponent,
    SaleDetailDialogComponent,
    DailyViewComponent,
    WeeklyViewComponent,
    ToolbarBackgroundComponent
  ]
})
export class SalesPageComponent extends MobileBasePage implements OnInit {

  filter: SalesPeriodFilter = new SalesPeriodFilter('today');
  filters!: SalesDetailFiltersOptions;
  selectedFilters?: SalesDetailFiltersOptions;
  totalAmount: number = 0;
  totalCount: number = 0;
  detailedSale?: SalesDetail;
  filteredSalesDaily: SalesDetail[] = [];
  filteredSalesWeekly: SalesCalendar[] = [];
  salesValues: SalesCardValues = { filter: this.filter };
  today = new Date();
  viewMode: SalesViewMode = 'daily';
  viewModeControl = new UntypedFormControl(this.viewMode);
  viewOrdering = 'desc';

  @ViewChild('saleDetailRef') private saleDetailRef!: TemplateRef<any>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    private route: ActivatedRoute,
    medalliaService: MedalliaService,
    router: Router) {
    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);

    const { start, end } = this.route.snapshot.queryParams;

    if ((start && end)) {
      this.filter = new SalesPeriodFilter(
        'custom',
        new DateRange<Date>(
          Date.fromString(start),
          Date.fromString(end)
        ));
    }

    this.subscribeSalesDetails();
    this.subscribeSalesDetailsFilters();
    this.subscribeSelectedSalesDetailsFilters();
    this.subscribeSalesCalendar();
  }

  ngOnInit(): void {
    const { start, end } = this.route.snapshot.queryParams;

    if ((start && end)) {
      this.filter = new SalesPeriodFilter(
        'custom',
        new DateRange<Date>(
          Date.fromString(start),
          Date.fromString(end)
        ));
    }

    this.viewModeControl.valueChanges
      .pipe(takeUntil(this.$unsub))
      .subscribe({
        next: (viewMode: SalesViewMode) => {
          this.viewMode = viewMode;
          this.filter = new SalesPeriodFilter((this.viewMode === 'weekly') ? 'lastWeek' : 'today');
          this.viewOrdering = this.viewMode === 'weekly' ? 'asc' : 'desc';
          this.viewMode === 'weekly' ? this.selectSalesCalendar() : this.selectSalesDetails();
        }
      });

    this.selectSalesDetails();
  }

  async onChangeDateRange(range: DateRange<Date>) {
    await this.sidenavService.close();

    this.filter = new SalesPeriodFilter('custom', range);
    this.viewMode === 'weekly' ? this.selectSalesCalendar() : this.selectSalesDetails();
  }

  onSummaryDetail() {
    const bottomSheetRef = this.bottomSheet.open(SalesDetailsDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        selectedEstablishments: this.selectedEstablishmentsUids,
        currentFilter: this.salesValues.filter,
        visibilityOn: this.visibilityOn
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((filter: SalesPeriodFilter) => {
        this.filter = filter;
        this.salesValues = {
          ...this.salesValues,
          filter: filter
        };
      });
  }

  onChangeStatus() {
    const bottomSheetRef = this.bottomSheet.open(OptionsFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Status',
        options: [...this.filters.status],
        selected: [...(this.selectedFilters?.status ?? [])]
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((paymentsStatus: string[]) => {
        if (paymentsStatus) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              status: paymentsStatus
            }

            this.store$.dispatch(new SalesStoreActions.FilterSalesDetailsAction({ filter: this.selectedFilters }));
          }
        }
      });
  }

  onChangePaymentTypes() {
    const bottomSheetRef = this.bottomSheet.open(OptionsFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Tipo de pagamento',
        options: [...this.filters.paymentTypes],
        selected: [...(this.selectedFilters?.paymentTypes ?? [])]
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((paymentTypes: string[]) => {
        if (paymentTypes) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              paymentTypes: paymentTypes
            }

            this.store$.dispatch(new SalesStoreActions.FilterSalesDetailsAction({ filter: this.selectedFilters }));
          }
        }
      });
  }

  onChangeCardBrands() {
    const bottomSheetRef = this.bottomSheet.open(OptionsFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Bandeiras',
        options: [...this.filters.cardBrands],
        selected: [...(this.selectedFilters?.cardBrands ?? [])]
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((cardBrands: string[]) => {
        if (cardBrands) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              cardBrands: cardBrands
            }

            this.store$.dispatch(new SalesStoreActions.FilterSalesDetailsAction({ filter: this.selectedFilters }));
          }
        }
      });
  }

  onChangeTimer() {
    const bottomSheetRef = this.bottomSheet.open(TimerFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Hora da Venda',
        timeValue: (this.selectedFilters?.salesTimes.length === 1 ? this.selectedFilters?.salesTimes[0] : null)
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((salesTimes: any) => {
        if (salesTimes) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              salesTimes: [...(salesTimes ?? this.selectedFilters?.salesTimes)]
            }

            this.store$.dispatch(new SalesStoreActions.FilterSalesDetailsAction({ filter: this.selectedFilters }));
          }
        }
      });
  }

  onChangeNsu() {
    const bottomSheetRef = this.bottomSheet.open(InputFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'NSU/DOC',
        inpValue: (this.selectedFilters?.nsus.length === 1 ? this.selectedFilters?.nsus[0] : null)
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((nsus: string[]) => {
        if (nsus) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              nsus: [...(nsus ?? this.selectedFilters?.nsus)]
            }

            this.store$.dispatch(new SalesStoreActions.FilterSalesDetailsAction({ filter: this.selectedFilters }));
          }
        }
      });
  }

  async onOpenDetailSale(sale: SalesDetail) {
    this.detailedSale = sale;
    await this.sidenavService.open(this.saleDetailRef);
  }

  async onCloseDetailSale() {
    this.detailedSale = undefined;
    await this.sidenavService.close();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.viewMode === 'weekly' ? this.selectSalesCalendar() : this.selectSalesDetails();
  }

  private selectSalesDetails() {
    if (this.hasSelectedEstablishments && !!this.filter) {
      const { end = null, start = null } = this.filter?.range ?? {};

      if (start && end) {
        this.store$.dispatch(
          new SalesStoreActions.SelectSalesDetailAction({
            initialDate: start.format(),
            finalDate: end.format(),
            uids: this.selectedEstablishmentsUids,
          }));
      }
    }
  }

  private selectSalesCalendar() {
    if (this.hasSelectedEstablishments && !!this.filter) {
      const { end = null, start = null } = this.filter?.range ?? {};

      if (start && end) {
        this.store$.dispatch(
          new SalesStoreActions.SelectSalesCalendarAction({
            initialDate: start.format(),
            finalDate: end.format(),
            uids: this.selectedEstablishmentsUids,
          }));
      }
    }
  }

  private subscribeSalesCalendar() {
    this.store$
      .select(SalesStoreSelectors.selectSalesCalendar)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesCalendar: SalesCalendar[]) => {
        this.filteredSalesWeekly = salesCalendar;

        if (this.viewMode === 'weekly') {
          const { end = null, start = null } = this.filter?.range ?? {};

          if (!!start && !!end) {

            var dates = [];
            while (start <= end) {
              dates.push(new Date(start));
              start.setDate(start.getDate() + 1);
            }

            dates.map(date => {

              const findSale = this.filteredSalesWeekly
                .find(x => x.sortingDate?.format('YYYY-MM-DDT00:00:00') === date.format('YYYY-MM-DDT00:00:00'));

              if (!findSale) {

                const saleCalendar = {
                  day: date.getDate(),
                  month: date.getMonth(),
                  year: date.getFullYear(),
                  yearMonthDay: date.format('YYYYMMDD'),
                  paymentStatus: '',
                  amount: 0,
                  sortingDate: date,
                  isCancelled: false,
                  debitAmount: 0,
                  debitCount: 0,
                  prepaidDebitAmount: 0,
                  prepaidDebitCount: 0,
                  creditAmount: 0,
                  creditCount: 0,
                  internationalCreditAmount: 0,
                  internationalCreditCount: 0,
                  prepaidCreditAmount: 0,
                  prepaidCreditCount: 0,
                  voucherAmount: 0,
                  voucherCount: 0,
                  installmentsAmount: 0,
                  installmentsCount: 0,
                  pixAmount: 0,
                  pixCount: 0,
                  isDebit: false,
                  isPrepaidDebit: false,
                  isCredit: false,
                  isPrepaidCredit: false,
                  isInternationalCredit: false,
                  isVoucher: false,
                  isPix: false,
                  isInstallments: false
                } as SalesCalendar;

                this.filteredSalesWeekly = [...this.filteredSalesWeekly, saleCalendar];
              }
            });
          }

          this.orderingWeeklyList();
          this.summarizeSalesWeekly();
        }

      });
  }

  private subscribeSalesDetails() {
    this.store$
      .select(SalesStoreSelectors.selectFilteredSalesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesDetails: SalesDetail[]) => {

        this.filteredSalesDaily = salesDetails;

        this.orderingDailyList();
        this.summarizeSalesDaily();
      });
  }

  private subscribeSalesDetailsFilters() {
    this.store$
      .select(SalesStoreSelectors.selectSalesDetailFilters)
      .pipe(takeUntil(this.$unsub))
      .subscribe((filters: SalesDetailFiltersOptions) => {
        this.filters = filters;
      });
  }

  private subscribeSelectedSalesDetailsFilters() {
    this.store$
      .select(SalesStoreSelectors.selectSelectedSalesDetailFilters)
      .pipe(takeUntil(this.$unsub))
      .subscribe((filters: any) => {
        this.selectedFilters = filters;
      });
  }

  private summarizeSalesWeekly() {
    this.totalAmount = this.filteredSalesWeekly
      ?.filter(s => s.paymentStatus !== 'Negada' && s.paymentStatus !== 'Desfeita')
      .reduce((sum, sale) => {
        return sum + sale.amount;
      }, 0);

    this.totalCount = this.filteredSalesWeekly
      .reduce((count, sale) => {
        const {
          debitCount = 0,
          creditCount = 0,
          voucherCount = 0,
          pixCount = 0,
          installmentsCount = 0,
          prepaidCreditCount = 0,
          internationalCreditCount = 0,
          prepaidDebitCount = 0,
        } = sale;

        count += debitCount
          + creditCount
          + voucherCount
          + pixCount
          + installmentsCount
          + prepaidCreditCount
          + internationalCreditCount
          + prepaidDebitCount

        return count;
      }, 0);
  }

  private summarizeSalesDaily() {
    this.totalAmount = this.filteredSalesDaily
      .reduce((sum, sale) => {
        return sum + sale.saleAmount;
      }, 0);

    this.totalCount = this.filteredSalesDaily
      .reduce((count, sale) => {
        const {
          debitCount = 0,
          creditCount = 0,
          voucherCount = 0,
          pixCount = 0,
          installmentsCount = 0,
          prepaidCreditCount = 0,
          internationalCreditCount = 0,
          prepaidDebitCount = 0,
        } = sale;

        count += debitCount
          + creditCount
          + voucherCount
          + pixCount
          + installmentsCount
          + prepaidCreditCount
          + internationalCreditCount
          + prepaidDebitCount

        return count;
      }, 0);
  }

  async goToSales(date: any) {

    this.viewMode = 'daily';
    this.viewModeControl.setValue(this.viewMode);

    this.filter = new SalesPeriodFilter(
      'custom',
      new DateRange<Date>(
        Date.fromString(date),
        Date.fromString(date)
      ));

    this.selectSalesDetails();
  }

  onClickOrdering() {

    this.viewOrdering = this.viewOrdering === 'asc' ? 'desc' : 'asc';

    this.orderingDailyList();
    this.orderingWeeklyList();
  }

  private orderingDailyList() {
    if (this.viewOrdering === 'desc') {
      this.filteredSalesDaily = [...this.filteredSalesDaily.sortBy((x: SalesDetail) => x.saleDate).reverse()];
    } else {
      this.filteredSalesDaily = [...this.filteredSalesDaily.sortBy((x: SalesDetail) => x.saleDate)];
    }
  }

  private orderingWeeklyList() {
    if (this.viewOrdering === 'desc') {
      this.filteredSalesWeekly = [...this.filteredSalesWeekly.sortBy((x: SalesCalendar) => x.day).reverse()];
    } else {
      this.filteredSalesWeekly = [...this.filteredSalesWeekly.sortBy((x: SalesCalendar) => x.day)];
    }
  }
}
