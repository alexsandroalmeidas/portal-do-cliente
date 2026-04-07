import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';
import { SharedModule } from '../../../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import {
  BottomSheetPanelFooterDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import {
  BottomSheetPanelHeaderToolsDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import { PaymentsStatus, PaymentStatusSelection } from './status-filter-selection.model';


@Component({
  selector: 'app-status-filter-dialog',
  standalone: true,
  templateUrl: './status-filter-dialog.component.html',
  styleUrls: ['./status-filter-dialog.component.scss'],
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ],
})
export class StatusFilterDialogComponent implements OnDestroy {
  private $unsub = new Subject();

  paymentsStatus: PaymentStatusSelection[] = [];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<StatusFilterDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      selectedPaymentStatus: string[]
    }) {

    this.paymentsStatus = PaymentsStatus.map(status => {
      return {
        selected: this.data.selectedPaymentStatus.some(t => t === status),
        status: status
      };
    });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onSelectPaymentStatus(index: number) {
    const paymentStatus = this.paymentsStatus.at(index);

    if (paymentStatus) {
      this.paymentsStatus.putAt(index, {
        ...paymentStatus,
        selected: !paymentStatus.selected
      });
    }
  }

  onSelectPaymentsStatus() {
    const selectedPayments = this.paymentsStatus
      .filter(e => e.selected)
      .map(e => e.status);

    this.bottomSheetRef.dismiss(selectedPayments);
  }
}
