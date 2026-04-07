import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store, select } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from 'src/app/root-store';
import { BankingAccount } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';
import { PunctualCancelDialogComponent } from '../punctual-cancel-dialog/punctual-cancel-dialog.component';

@Component({
  selector: 'app-punctual-details-dialog',
  templateUrl: './punctual-details-dialog.component.html',
  styleUrls: ['./punctual-details-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class PunctualDetailsDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  visibilityOn: boolean = false;
  totalAmount = 0;
  prepaymentTotalAmount = 0;
  rate = 0;
  schedule: any;
  bankingAccount: BankingAccount = {} as BankingAccount;

  constructor(
    private store$: Store<AppState>,
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<PunctualDetailsDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      totalAmount: number;
      prepaymentTotalAmount: number;
      rate: number;
      visibilityOn: boolean;
      bankingAccount: BankingAccount;
      schedule: any;
    }) {

    this.visibilityOn = data.visibilityOn;
    this.totalAmount = data.totalAmount;
    this.prepaymentTotalAmount = data.prepaymentTotalAmount;
    this.rate = data.rate;
    this.bankingAccount = data.bankingAccount ?? { accountNumber: 0, agency: 0, bank: '', bankCode: 0, checkDigitNumber: '', documentNumber: '' } as BankingAccount;
    this.schedule = data.schedule;
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

  onClose() {
    this.bottomSheetRef.dismiss(false);
  }

  onConfirm() {
    this.bottomSheetRef.dismiss(true);
  }

  async openPunctualCancelDialog() {

    const bottomSheetRef = this.bottomSheet.open(PunctualCancelDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {}
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (!confirm) {
          this.bottomSheetRef.dismiss(null);
        } else {
          this.onConfirm();
        }
      });
  }
}
