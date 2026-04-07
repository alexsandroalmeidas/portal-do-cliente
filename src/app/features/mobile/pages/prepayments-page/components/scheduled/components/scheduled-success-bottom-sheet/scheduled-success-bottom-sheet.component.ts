import { CoreStoreSelectors } from '@/root-store/core-store';
import { AppState } from '@/root-store/state';
import { SharedModule } from '@/shared/shared.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import {
  BottomSheetPanelBodyDirective
} from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import {
  BottomSheetPanelFooterDirective
} from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import {
  BottomSheetPanelHeaderToolsDirective
} from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from './../../../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';

@Component({
  selector: 'app-scheduled-success-bottom-sheet',
  templateUrl: './scheduled-success-bottom-sheet.component.html',
  styleUrls: ['./scheduled-success-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class ScheduledSuccessBottomSheetComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<ScheduledSuccessBottomSheetComponent>) {
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
    this.bottomSheetRef.dismiss(true);
  }
}
