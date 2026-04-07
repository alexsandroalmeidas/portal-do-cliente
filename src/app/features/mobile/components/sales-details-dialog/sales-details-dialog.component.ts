import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { SalesPeriod, SalesPeriodFilter, SalesPeriodFilterOptions } from '../../models/period-filter';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from './../../../../root-store';
import { SalesStoreActions, SalesStoreSelectors } from './../../../../root-store/sales-store';
import { SalesDetail } from './../../../../root-store/sales-store/sales.models';
import { AppState } from './../../../../root-store/state';
import { SharedModule } from './../../../../shared/shared.module';
import { SalesDetailsSummary } from './sales-details-summary';

@Component({
  selector: 'app-sales-details-dialog',
  templateUrl: './sales-details-dialog.component.html',
  styleUrls: ['./sales-details-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class SalesDetailsDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  form!: UntypedFormGroup;
  totalSales?: number;
  filter: SalesPeriodFilter = new SalesPeriodFilter('today');
  salesSummary: SalesDetailsSummary[] = [];
  visibilityOn: boolean = false;

  salesPeriodOptions = Object.keys(SalesPeriodFilterOptions)
    .map(key => ({ value: key, label: SalesPeriodFilterOptions[key] }));

  constructor(
    private fb: UntypedFormBuilder,
    private store$: Store<AppState>,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<SalesDetailsDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      selectedEstablishments: string[];
      currentFilter: SalesPeriodFilter;
      showDetailsButtom: boolean;
      visibilityOn: boolean;
    }) {

    this.visibilityOn = data.visibilityOn;
    this.filter = data.currentFilter;
    this.onFilterSales();
  }

  ngOnInit() {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onClose();
        }
      });

    this.form = this.fb.group({
      period: [this.filter.period, []]
    });

    this.form.get('period')?.valueChanges
      .pipe(takeUntil(this.$unsub))
      .subscribe((period: SalesPeriod) => {
        this.filter = new SalesPeriodFilter(period);
        this.onFilterSales();
      });

    this.subscribeSalesDetails();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  async goToSales() {
    this.onClose();

    const { period, range: { start, end } } = this.filter;

    await this.router.navigate(
      ['/sales/mobile'],
      {
        queryParams: {
          start: start?.format('YYYY-MM-DD'),
          end: end?.format('YYYY-MM-DD')
        }
      });
  }

  onClose() {
    const form = this.form.getRawValue() as { period: SalesPeriod };
    const { period } = form;

    this.bottomSheetRef.dismiss(new SalesPeriodFilter(period));
  }

  private onFilterSales() {
    const { start, end } = this.filter.range;

    if (start && end) {
      this.store$.dispatch(new SalesStoreActions.SelectSalesDetailAction({
        initialDate: start.format(),
        finalDate: end.format(),
        uids: this.data.selectedEstablishments,
      }));
    }
  }

  private subscribeSalesDetails() {
    this.store$
      .select(SalesStoreSelectors.selectSalesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesDetail: SalesDetail[]) => {

        const sales = salesDetail
          ?.filter(s => !s.isCancelled
            && s.status !== 'Negada' && s.status !== 'Desfeita'
          ) || [];

        this.salesSummary = [];

        this.sumarizeCredits(sales);

        this.sumarizeInternationalCredits(sales);

        this.sumarizeInstallments(sales);

        this.sumarizePrepaidCredits(sales);

        this.sumarizeDebits(sales);

        this.sumarizePrepaidDebits(sales);

        this.sumarizePix(sales);

        this.sumarizeVouchers(sales);

        this.totalSales = this.salesSummary.sumBy(p => p.amount);
      });
  }

  private sumarizeCredits(sales: SalesDetail[]) {
    const credits = sales.filter(c => c.isCredit);

    if (!!credits && credits.some(x => x.creditCount > 0)) {

      var count = credits.sumBy(p => p.creditCount);
      var amount = credits.sumBy(p => p.creditAmount);
      var paymentType = credits.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Crédito à Vista'),
          count,
          amount
        });
    }
  }

  private sumarizeInternationalCredits(sales: SalesDetail[]) {
    const internationalCredits = sales.filter(c => c.isInternationalCredit);

    if (!!internationalCredits && internationalCredits.some(x => x.internationalCreditCount > 0)) {

      var count = internationalCredits.sumBy(p => p.internationalCreditCount);
      var amount = internationalCredits.sumBy(p => p.internationalCreditAmount);
      var paymentType = internationalCredits.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Crédito Internacional'),
          count,
          amount
        });
    }
  }

  private sumarizeInstallments(sales: SalesDetail[]) {
    const installments = sales.filter(c => c.isInstallments);

    if (!!installments && installments.some(x => x.installmentsCount > 0)) {

      var count = installments.sumBy(p => p.installmentsCount);
      var amount = installments.sumBy(p => p.installmentsAmount);
      var paymentType = installments.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Parcelado 2 a 12x'),
          count,
          amount
        });
    }
  }

  private sumarizePrepaidCredits(sales: SalesDetail[]) {
    const prepaidCredits = sales.filter(c => c.isPrepaidCredit);

    if (!!prepaidCredits && prepaidCredits.some(x => x.prepaidCreditCount > 0)) {

      var count = prepaidCredits.sumBy(p => p.prepaidCreditCount);
      var amount = prepaidCredits.sumBy(p => p.prepaidCreditAmount);
      var paymentType = prepaidCredits.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Crédito Pré-Pago'),
          count,
          amount
        });
    }
  }

  private sumarizeDebits(sales: SalesDetail[]) {
    const debits = sales.filter(c => c.isDebit);

    if (!!debits && debits.some(x => x.debitCount > 0)) {

      var count = debits.sumBy(p => p.debitCount);
      var amount = debits.sumBy(p => p.debitAmount);
      var paymentType = debits.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Débito'),
          count,
          amount
        });
    }
  }

  private sumarizePrepaidDebits(sales: SalesDetail[]) {
    const prepaidDebits = sales.filter(c => c.isPrepaidDebit);

    if (!!prepaidDebits && prepaidDebits.some(x => x.prepaidDebitCount > 0)) {

      var count = prepaidDebits.sumBy(p => p.prepaidDebitCount);
      var amount = prepaidDebits.sumBy(p => p.prepaidDebitAmount);
      var paymentType = prepaidDebits.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Débito Pré-Pago'),
          count,
          amount
        });
    }
  }

  private sumarizePix(sales: SalesDetail[]) {
    const pixes = sales.filter(c => c.isPix);

    if (!!pixes && pixes.some(x => x.pixCount > 0)) {

      var count = pixes.sumBy(p => p.pixCount);
      var amount = pixes.sumBy(p => p.pixAmount);
      var paymentType = pixes.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Pix'),
          count,
          amount
        });
    }
  }

  private sumarizeVouchers(sales: SalesDetail[]) {
    const vouchers = sales.filter(c => c.isVoucher);

    if (!!vouchers && vouchers.some(x => x.voucherCount > 0)) {

      var count = vouchers.sumBy(p => p.voucherCount);
      var amount = vouchers.sumBy(p => p.voucherAmount);
      var paymentType = vouchers.shift();

      this.salesSummary.push(
        {
          label: (paymentType?.paymentType ?? 'Voucher'),
          count,
          amount
        });
    }
  }
}
