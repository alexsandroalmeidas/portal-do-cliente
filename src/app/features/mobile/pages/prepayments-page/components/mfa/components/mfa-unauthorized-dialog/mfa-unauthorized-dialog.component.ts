import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { BottomSheetPanelBodyDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelComponent } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel.component';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  templateUrl: './mfa-unauthorized-dialog.component.html',
  styleUrls: ['./mfa-unauthorized-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelBodyDirective
  ]
})
export class MfaUnauthorizedDialogComponent implements OnDestroy {

  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<MfaUnauthorizedDialogComponent>) {
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onActivateClick() {
    this.bottomSheetRef.dismiss(true);
  }

  onCancelClick() {
    this.bottomSheetRef.dismiss(false);
  }
}
