import { CoreStoreSelectors } from '@/root-store/core-store';
import { AppState } from '@/root-store/state';
import { SharedModule } from '@/shared/shared.module';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from './../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from './../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from './../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from './../bottom-sheet-panel/bottom-sheet-panel.component';

@Component({
  selector: 'app-confirmation-bottom-sheet',
  templateUrl: './confirmation-bottom-sheet.component.html',
  styleUrls: ['./confirmation-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class ConfirmationBottomSheetComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<ConfirmationBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      title: string;
      description: string;
      okText?: string;
      cancelText?: string;
    }) {
  }

  ngOnInit() {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onCancelClick();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancelClick() {
    this.bottomSheetRef.dismiss(false);
  }

  onOkClick() {
    this.bottomSheetRef.dismiss(true);
  }
}
