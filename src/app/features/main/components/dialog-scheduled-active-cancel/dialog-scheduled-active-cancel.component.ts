import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-scheduled-active-cancel',
  templateUrl: './dialog-scheduled-active-cancel.component.html',
  styleUrls: ['./dialog-scheduled-active-cancel.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class DialogScheduledActiveCancelComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<DialogScheduledActiveCancelComponent>) {
  }

  ngOnInit() {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onCancelClick(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onKeepClick() {
    this.dialogRef.close(true);
  }

  onCancelClick(ret: any) {
    this.dialogRef.close(ret);
  }
}
