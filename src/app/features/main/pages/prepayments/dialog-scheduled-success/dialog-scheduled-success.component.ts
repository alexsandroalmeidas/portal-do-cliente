import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-scheduled-success',
  templateUrl: './dialog-scheduled-success.component.html',
  styleUrls: ['./dialog-scheduled-success.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class DialogScheduledSuccessComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<DialogScheduledSuccessComponent>) {
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
    this.dialogRef.close(true);
  }
}