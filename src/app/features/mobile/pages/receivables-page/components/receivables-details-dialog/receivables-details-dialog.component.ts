import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from '../../../../../../root-store';
import { ReceivablesStoreSelectors } from '../../../../../../root-store/receivables-store';
import { ReceivableCalendarAdjustment, ReceivableDetail } from '../../../../../../root-store/receivables-store/receivables.models';
import { AppState } from '../../../../../../root-store/state';
import { SharedModule } from '../../../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import {
  BottomSheetPanelFooterDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import {
  BottomSheetPanelHeaderToolsDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import { ReceivablesPeriodFilter } from '../../../../models/period-filter';

@Component({
  selector: 'app-receivables-details-dialog',
  templateUrl: './receivables-details-dialog.component.html',
  styleUrls: ['./receivables-details-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class ReceivablesDetailsDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  filter: ReceivablesPeriodFilter;

  totalAmount: number = 0;
  receivablesCreditAmount: number = 0;
  receivablesPrepaymentAmount: number = 0;
  adjustmentsCreditAmount: number = 0;
  adjustmentsDebitAmount: number = 0;
  visibilityOn: boolean = false;

  adjustmentsCredits: ReceivableCalendarAdjustment[] = [];
  adjustmentsDebits: ReceivableCalendarAdjustment[] = [];

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<ReceivablesDetailsDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      selectedEstablishmentsUids: string[];
      currentFilter: ReceivablesPeriodFilter;
      visibilityOn: boolean;
    }) {

    this.visibilityOn = data.visibilityOn;
    this.filter = data.currentFilter;
    this.subscribeReceivablesDetails();
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
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  async goToReceivables() {
    this.onClose();
    await this.router.navigate(['/receivables/mobile']);
  }

  onClose() {
    this.bottomSheetRef.dismiss();
  }

  sumarizeAll(receivables: ReceivableDetail[]) {
    this.receivablesPrepaymentAmount =
      receivables?.filter(s => !s.isAdjust).sumBy((d) => d.prepaymentFeeAmount);

    this.receivablesCreditAmount =
      receivables?.filter(s => !s.isAdjust).sumBy((s) => s.paymentValue) || 0;

    this.adjustmentsCreditAmount =
      receivables?.filter(s => s.isAdjust
        && s.releaseTypeDescription.includes('Ajuste a Crédito')).sumBy((s) => s.releaseValue) || 0;

    this.adjustmentsDebitAmount =
      receivables?.filter(s => s.isAdjust
        && s.releaseTypeDescription.includes('Ajuste a Débito')).sumBy((s) => s.releaseValue) || 0;

    this.sumarizeAdjustments(receivables);

    this.totalAmount = receivables?.filter(s => !s.isAdjust).sumBy((s) => s.paymentAmount) || 0;
  }

  private subscribeReceivablesDetails() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesDetail) => {
        this.sumarizeAll(receivablesDetail);
      });
  }

  private sumarizeAdjustments(receivables: ReceivableDetail[]) {
    const adjustmentsCredits: ReceivableCalendarAdjustment[] = [];

    receivables.filter(x => x.isAdjust && x.adjustmentType === 1)
      .forEach(receivable => {
        adjustmentsCredits.push({ description: receivable.releaseDescription, amount: receivable.releaseValue });
      });

    const adjustmentsDebits: ReceivableCalendarAdjustment[] = [];

    receivables.filter(x => x.isAdjust && x.adjustmentType === 2)
      .forEach(receivable => {
        adjustmentsDebits.push({ description: receivable.releaseDescription, amount: receivable.releaseValue });
      });

    this.adjustmentsCreditAmount = adjustmentsCredits.sumBy(p => p.amount);
    this.adjustmentsDebitAmount = adjustmentsDebits.sumBy(p => p.amount);

    this.groupingAdjustments(adjustmentsCredits, adjustmentsDebits);
  }

  private groupingAdjustments(
    adjustmentsCredits: ReceivableCalendarAdjustment[],
    adjustmentsDebits: ReceivableCalendarAdjustment[]) {

    const groupCredits = adjustmentsCredits.groupBy(p => p.description);

    this.adjustmentsCredits = Object.keys(groupCredits)
      .map(key => {
        return {
          description: key,
          amount: groupCredits[key].sumBy((d) => d.amount)
        };
      });


    const groupDebits = adjustmentsDebits.groupBy(p => p.description);

    this.adjustmentsDebits = Object.keys(groupDebits)
      .map(key => {
        return {
          description: key,
          amount: groupDebits[key].sumBy((d) => d.amount)
        };
      });
  }
}
