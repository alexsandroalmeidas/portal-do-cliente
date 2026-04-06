import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from 'src/app/root-store';
import { BankingAccount, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-scheduled-final-check',
  templateUrl: './dialog-scheduled-final-check.component.html',
  styleUrls: ['./dialog-scheduled-final-check.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogScheduledFinalCheckComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  visibilityOn: boolean = true;
  bankingAccount: BankingAccount;
  rate: number;
  scheduledMode: string;
  selection: string = null as any;
  selectedAccreditations: string[] = null as any;

  get getScheduledMode() {

    let scheduleModeReturn = 'Diariamente';

    if (!!this.scheduledMode) {
      scheduleModeReturn = (this.scheduledMode === 'monthly-accreditations' || this.scheduledMode === 'monthly-check')
        ? 'Mensalmente'
        : (this.scheduledMode === 'weekly-accreditations' || this.scheduledMode === 'weekly-check')
          ? 'Semanalmente'
          : 'Diariamente';
    }

    return scheduleModeReturn;
  }

  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<DialogScheduledFinalCheckComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.rate = data.rate;
    this.bankingAccount = data.bankingAccount;
    this.scheduledMode = data.scheduledMode;
    this.selection = data.selection;
    this.selectedAccreditations = data.selectedAccreditations;
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