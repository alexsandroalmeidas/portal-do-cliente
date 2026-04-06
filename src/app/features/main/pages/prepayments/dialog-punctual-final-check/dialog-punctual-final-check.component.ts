import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { BankingAccount, ReceivablesSchedule, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { CoreStoreSelectors } from 'src/app/root-store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-punctual-final-check',
  templateUrl: './dialog-punctual-final-check.component.html',
  styleUrls: ['./dialog-punctual-final-check.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogPunctualFinalCheckComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  bankingAccount: BankingAccount;
  totalAmount: number;
  rate: number;
  prepaymentTotalAmount: number;
  schedules: ReceivablesSchedule[] = [];
  selectedAccreditations: string[] = null as any;

  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<DialogPunctualFinalCheckComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.bankingAccount = data.bankingAccount;
    this.totalAmount = data.totalAmount;
    this.rate = data.rate;
    this.prepaymentTotalAmount = data.prepaymentTotalAmount;
    this.schedules = data.schedules;

    this.selectedAccreditations = [];

    if (!!data.schedules) {
      this.selectedAccreditations = Array.from(new Set(data.schedules.map((item: any) => item.documentNumberAccreditor)));
    }
  }

  ngOnInit() {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onClose(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose(value: any) {
    this.dialogRef.close(value);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }
}