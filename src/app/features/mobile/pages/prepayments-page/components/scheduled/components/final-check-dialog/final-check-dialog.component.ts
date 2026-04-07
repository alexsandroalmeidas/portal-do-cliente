import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from 'src/app/root-store';
import { BankingAccount, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-final-check-dialog',
  templateUrl: './final-check-dialog.component.html',
  styleUrls: ['./final-check-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class FinalCheckDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  visibilityOn: boolean = false;
  bankingAccount: BankingAccount;
  rate: number;
  scheduledMode: string;
  selection: string = null as any;
  accreditations: string[] = [];

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
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<FinalCheckDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      rate: number;
      visibilityOn: boolean;
      bankingAccount: BankingAccount;
      scheduledMode: string;
      selection: string,
      selectedAccreditations: string[]
    }) {

    this.visibilityOn = data.visibilityOn;
    this.rate = data.rate;
    this.bankingAccount = data.bankingAccount;
    this.scheduledMode = data.scheduledMode;
    this.selection = data.selection;
    this.accreditations = data.selectedAccreditations;
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
    this.bottomSheetRef.dismiss(value);
  }

  onConfirm() {
    this.bottomSheetRef.dismiss(true);
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }
}