import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from 'src/app/features/mobile/components/bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-punctual-success-dialog',
  templateUrl: './punctual-success-dialog.component.html',
  styleUrls: ['./punctual-success-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class PunctualSuccessDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  @Input() documentNumberSelected: string = '';

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<PunctualSuccessDialogComponent>,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      documentNumberSelected: string;
    }) {

    this.documentNumberSelected = data.documentNumberSelected;
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

  async goActivate() {
    this.bottomSheetRef.dismiss(null);
  }
}