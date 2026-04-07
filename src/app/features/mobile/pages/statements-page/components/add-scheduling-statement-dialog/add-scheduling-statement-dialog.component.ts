import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from '../../../../../../root-store';
import { SharedModule } from '../../../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import {
  BottomSheetPanelFooterDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import {
  BottomSheetPanelHeaderToolsDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import { AppState } from './../../../../../../root-store/state';

@Component({
  selector: 'app-add-scheduling-statement-dialog',
  templateUrl: './add-scheduling-statement-dialog.component.html',
  styleUrls: ['./add-scheduling-statement-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class AddSchedulingStatementDialogComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  form!: UntypedFormGroup;

  constructor(
    private store$: Store<AppState>,
    private fb: UntypedFormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddSchedulingStatementDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {}) {
  }

  ngOnInit() {
    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onCancel();
        }
      });

    this.form = this.fb.group({
      start: [null, [Validators.required]],
      end: [null, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancel() {
    this.bottomSheetRef.dismiss();
  }

  onSend() {
    if (this.form.invalid) {
      return;
    }

    const form = this.form.getRawValue() as { start: Moment, end: Moment };
    const { start, end } = form;

    this.bottomSheetRef.dismiss({
      start: start.toDate().date(),
      end: end.toDate().date().addDays(1).addSeconds(-1)
    });
  }
}
