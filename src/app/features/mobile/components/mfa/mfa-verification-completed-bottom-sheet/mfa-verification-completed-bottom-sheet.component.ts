import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../bottom-sheet-panel/bottom-sheet-panel.component';

@Component({
  templateUrl: './mfa-verification-completed-bottom-sheet.component.html',
  styleUrls: ['./mfa-verification-completed-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class MfaVerificationCompletedBottomSheetComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<MfaVerificationCompletedBottomSheetComponent>
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCloseClick() {
    this.bottomSheetRef.dismiss(false);
  }
}
