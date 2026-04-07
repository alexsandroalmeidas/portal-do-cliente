import { environment as env } from '@/environments/environment';
import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DateRange } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs';
import {
  ReceivablesStoreActions,
  ReceivablesStoreSelectors
} from '../../../../root-store/receivables-store';
import {
  ReceivableCalendar,
  ReceivableDetail
} from '../../../../root-store/receivables-store/receivables.models';
import { ReceivablesDetailFiltersOptions } from '../../../../root-store/receivables-store/receivables.state';
import { AppState } from '../../../../root-store/state';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { SharedModule } from '../../../../shared/shared.module';
import { OptionsFilterDialogComponent } from '../../components/options-filter-dialog/options-filter-dialog.component';
import { PeriodFilterDialogComponent } from '../../components/period-filter-dialog/period-filter-dialog.component';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { ReceivablesPeriodFilter } from '../../models/period-filter';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { ToolbarBackgroundComponent } from './../../components/toolbar-background/toolbar-background.component';
import { DailyViewComponent } from './components/daily-view/daily-view.component';
import { ReceivableDetailDialogComponent } from './components/receivable-detail-dialog/receivable-detail-dialog.component';
import { ReceivablesDetailsDialogComponent } from './components/receivables-details-dialog/receivables-details-dialog.component';
import { PaymentsStatus } from './components/status-filter-dialog/status-filter-selection.model';
import { WeeklyViewComponent } from './components/weekly-view/weekly-view.component';

export type ReceivablesViewMode = 'daily' | 'weekly';

@Component({
  standalone: true,
  templateUrl: './receivables-page.component.html',
  styleUrls: ['./receivables-page.component.scss'],
  imports: [
    SharedModule,
    PeriodFilterDialogComponent,
    ReceivableDetailDialogComponent,
    DailyViewComponent,
    WeeklyViewComponent,
    ToolbarBackgroundComponent,
    TooltipComponent
  ]
})
export class ReceivablesPageComponent extends MobileBasePage implements OnInit {
  totalAmount?: number;
  detailedReceivable?: ReceivableDetail;
  filters!: ReceivablesDetailFiltersOptions;
  selectedFilters?: ReceivablesDetailFiltersOptions;
  filteredReceivablesDaily: ReceivableDetail[] = [];
  filteredReceivablesWeekly: ReceivableCalendar[] = [];
  selectedPaymentStatus: string[] = PaymentsStatus;
  filter: ReceivablesPeriodFilter = new ReceivablesPeriodFilter('today');
  viewMode: ReceivablesViewMode = 'daily';
  viewModeControl = new UntypedFormControl(this.viewMode);
  viewOrdering = 'desc';
  receivablesClickHere = env.receivablesClickHere;
  lastUpdateDate!: Date;

  @ViewChild('receivableDetailRef') private receivableDetailRef!: TemplateRef<any>;

  get hasEstablishmentsSelected() {
    return !Array.isEmpty(this.selectedEstablishmentsUids);
  }

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    private route: ActivatedRoute,
    medalliaService: MedalliaService,
    router: Router
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router
    );

    const { start, end } = this.route.snapshot.queryParams;

    if (start && end) {
      this.filter = new ReceivablesPeriodFilter(
        'custom',
        new DateRange<Date>(Date.fromString(start), Date.fromString(end))
      );
    }

    this.subscribeLastUpdateDateReceivables();
    this.subscribeReceivablesDetails();
    this.subscribeReceivablesDetailsFilters();
    this.subscribeSelectedReceivablesDetailsFilters();
    this.subscribeReceivablesCalendar();
  }

  ngOnInit(): void {
    const { start, end } = this.route.snapshot.queryParams;

    if (start && end) {
      this.filter = new ReceivablesPeriodFilter(
        'custom',
        new DateRange<Date>(Date.fromString(start), Date.fromString(end))
      );
    }

    this.viewModeControl.valueChanges.pipe(takeUntil(this.$unsub)).subscribe({
      next: (viewMode: ReceivablesViewMode) => {
        this.viewMode = viewMode;
        this.filter = new ReceivablesPeriodFilter(
          this.viewMode === 'weekly' ? 'nextWeek' : 'today'
        );
        this.viewOrdering = this.viewMode === 'weekly' ? 'asc' : 'desc';
        this.viewMode === 'weekly'
          ? this.selectReceivablesCalendar()
          : this.selectReceivablesDetails();
      }
    });

    this.selectReceivablesDetails();
  }

  async onChangeDateRange(range: DateRange<Date>) {
    await this.sidenavService.close();

    this.filter = new ReceivablesPeriodFilter('custom', range);
    this.viewMode === 'weekly' ? this.selectReceivablesCalendar() : this.selectReceivablesDetails();
  }

  onReceivablesDetails() {
    this.bottomSheet.open(ReceivablesDetailsDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        selectedEstablishmentsUids: this.selectedEstablishmentsUids,
        currentFilter: this.filter,
        visibilityOn: this.visibilityOn
      }
    });
  }

  onChangeStatus() {
    const bottomSheetRef = this.bottomSheet.open(OptionsFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Status',
        options: [
          ...(this.viewMode === 'weekly'
            ? this.filters.status.filter((x) => !x.includes('Liquidado'))
            : this.filters.status)
        ],
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
            };

            this.store$.dispatch(
              new ReceivablesStoreActions.FilterReceivablesDetailsAction({
                filter: this.selectedFilters
              })
            );
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
        options: [
          ...(this.viewMode === 'weekly'
            ? this.filters.paymentTypes.filter((x) => !x.includes('Ajuste'))
            : this.filters.paymentTypes)
        ],
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
            };

            this.store$.dispatch(
              new ReceivablesStoreActions.FilterReceivablesDetailsAction({
                filter: this.selectedFilters
              })
            );
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
            };

            this.store$.dispatch(
              new ReceivablesStoreActions.FilterReceivablesDetailsAction({
                filter: this.selectedFilters
              })
            );
          }
        }
      });
  }

  onChangeReleaseTypes() {
    const bottomSheetRef = this.bottomSheet.open(OptionsFilterDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      data: {
        title: 'Tipos de Lançamentos',
        options: [
          ...(this.viewMode === 'weekly'
            ? this.filters.releaseTypes.filter((x) => !x.includes('Ajuste'))
            : this.filters.releaseTypes)
        ],
        selected: [...(this.selectedFilters?.releaseTypes ?? [])]
      }
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((releaseTypes: string[]) => {
        if (releaseTypes) {
          if (this.selectedFilters) {
            this.selectedFilters = {
              ...this.selectedFilters,
              releaseTypes: releaseTypes
            };

            this.store$.dispatch(
              new ReceivablesStoreActions.FilterReceivablesDetailsAction({
                filter: this.selectedFilters
              })
            );
          }
        }
      });
  }

  async onOpenDetailReceivable(receivable: ReceivableDetail) {
    this.detailedReceivable = receivable;
    await this.sidenavService.open(this.receivableDetailRef);
  }

  async onCloseDetailReceivable() {
    this.detailedReceivable = undefined;
    await this.sidenavService.close();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.selectReceivablesDetails();
  }

  private selectReceivablesDetails() {
    if (this.hasSelectedEstablishments && !!this.filter) {
      const { end = null, start = null } = this.filter?.range ?? {};

      if (start && end) {
        this.store$.dispatch(
          new ReceivablesStoreActions.SelectReceivablesDetailAction({
            initialDate: start.format(),
            finalDate: end.format(),
            uids: this.selectedEstablishmentsUids
          })
        );
      }
    }
  }

  private selectReceivablesCalendar() {
    if (this.hasSelectedEstablishments && !!this.filter) {
      const { end = null, start = null } = this.filter?.range ?? {};

      if (start && end) {
        this.store$.dispatch(
          new ReceivablesStoreActions.SelectReceivablesCalendarAction({
            initialDate: start.format(),
            finalDate: end.format(),
            uids: this.selectedEstablishmentsUids
          })
        );
      }
    }
  }

  private subscribeLastUpdateDateReceivables() {
    this.store$
      .select(ReceivablesStoreSelectors.selectLastUpdateDateReceivables)
      .pipe(takeUntil(this.$unsub))
      .subscribe((last) => {
        if (!!last) this.lastUpdateDate = last.lastUpdateDate;
      });
  }

  private subscribeReceivablesDetails() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivables: ReceivableDetail[]) => {
        this.filteredReceivablesDaily = receivables;

        this.summarizeReceivablesDaily();
        this.orderingDailyList();
      });
  }

  private subscribeReceivablesCalendar() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesCalendar)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivables: ReceivableCalendar[]) => {
        this.filteredReceivablesWeekly = receivables;

        if (this.viewMode === 'weekly') {
          const { end = null, start = null } = this.filter?.range ?? {};

          if (!!start && !!end) {
            var dates = [];
            while (start <= end) {
              dates.push(new Date(start));
              start.setDate(start.getDate() + 1);
            }

            dates.map((date) => {
              const findRec = this.filteredReceivablesWeekly.find(
                (x) =>
                  x.sortingDate?.format('YYYY-MM-DDT00:00:00') ===
                  date.format('YYYY-MM-DDT00:00:00')
              );

              if (!findRec) {
                const receivableDetail = {
                  day: date.getDate(),
                  month: date.getMonth(),
                  year: date.getFullYear(),
                  paymentStatus: '',
                  amount: 0,
                  yearMonthDay: date.format('YYYYMMDD'),
                  sortingDate: date,
                  paymentDate: date,
                  receivablesPrepaymentAmount: 0,
                  receivablesCreditAmount: 0,
                  isCancelled: false,
                  isAdjust: false,
                  isPix: false,
                  adjustmentsCredits: [],
                  adjustmentsDebits: []
                } as ReceivableCalendar;

                this.filteredReceivablesWeekly = [
                  ...this.filteredReceivablesWeekly,
                  receivableDetail
                ];
              }
            });
          }

          this.orderingWeeklyList();
          this.summarizeReceivablesCalendar();
        }
      });
  }

  private subscribeReceivablesDetailsFilters() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesDetailFilters)
      .pipe(takeUntil(this.$unsub))
      .subscribe((filters: ReceivablesDetailFiltersOptions) => {
        this.filters = filters;
      });
  }

  private subscribeSelectedReceivablesDetailsFilters() {
    this.store$
      .select(ReceivablesStoreSelectors.selectSelectedReceivablesDetailFilters)
      .pipe(takeUntil(this.$unsub))
      .subscribe((filters: any) => {
        this.selectedFilters = filters;
      });
  }

  private summarizeReceivablesCalendar() {
    this.totalAmount = this.filteredReceivablesWeekly?.sumBy((s) => s.amount) || 0;
  }

  private summarizeReceivablesDaily() {
    const receivablesCreditAmount =
      this.filteredReceivablesDaily?.filter((s) => !s.isAdjust).sumBy((s) => s.paymentAmount) || 0;

    const adjustmentsCreditAmount =
      this.filteredReceivablesDaily
        ?.filter((s) => s.isAdjust && s.releaseTypeDescription.includes('Ajuste a Crédito'))
        .sumBy((s) => s.releaseValue) || 0;

    const adjustmentsDebitAmount =
      this.filteredReceivablesDaily
        ?.filter((s) => s.isAdjust && s.releaseTypeDescription.includes('Ajuste a Débito'))
        .sumBy((s) => s.releaseValue) || 0;

    this.totalAmount = receivablesCreditAmount + adjustmentsCreditAmount + adjustmentsDebitAmount;
  }

  async goToReceivables(date: any) {
    this.viewMode = 'daily';
    this.viewModeControl.setValue(this.viewMode);

    this.filter = new ReceivablesPeriodFilter(
      'custom',
      new DateRange<Date>(Date.fromString(date), Date.fromString(date))
    );

    this.selectReceivablesDetails();
  }

  onClickOrdering() {
    this.viewOrdering = this.viewOrdering === 'asc' ? 'desc' : 'asc';

    this.orderingDailyList();
    this.orderingWeeklyList();
  }

  private orderingDailyList() {
    if (this.viewOrdering === 'desc') {
      this.filteredReceivablesDaily = [
        ...this.filteredReceivablesDaily.sortBy((x: ReceivableDetail) => x.paymentDate).reverse()
      ];
    } else {
      this.filteredReceivablesDaily = [
        ...this.filteredReceivablesDaily.sortBy((x: ReceivableDetail) => x.paymentDate)
      ];
    }
  }

  private orderingWeeklyList() {
    if (this.viewOrdering === 'desc') {
      this.filteredReceivablesWeekly = [
        ...this.filteredReceivablesWeekly.sortBy((x: ReceivableCalendar) => x.day).reverse()
      ];
    } else {
      this.filteredReceivablesWeekly = [
        ...this.filteredReceivablesWeekly.sortBy((x: ReceivableCalendar) => x.day)
      ];
    }
  }
}
