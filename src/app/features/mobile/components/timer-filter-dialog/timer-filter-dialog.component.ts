import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from './../../../../root-store';
import { AppState } from './../../../../root-store/state';


@Component({
  selector: 'app-timer-filter-dialog',
  standalone: true,
  templateUrl: './timer-filter-dialog.component.html',
  styleUrls: ['./timer-filter-dialog.component.scss'],
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ],
})
export class TimerFilterDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  timeValue = new FormControl(null);

  get title() {
    return this.data?.title;
  }

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<TimerFilterDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      title: string;
      timeValue: any;
      iconMap: { [key: string]: string }
    }) {
    this.timeValue.setValue(data.timeValue);
  }

  ngOnInit(): void {
    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.bottomSheetRef.dismiss();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  getIcon(option: string) {
    if (this.data.iconMap && option in this.data.iconMap) {
      return this.data.iconMap[option];
    }

    return '';
  }

  onClose() {
    this.bottomSheetRef.dismiss(this.timeValue.value ? [this.timeValue.value] : []);
  }
}
