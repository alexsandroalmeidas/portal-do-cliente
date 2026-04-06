import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CoreStoreSelectors } from 'src/app/root-store';
import { AppState } from 'src/app/root-store/state';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-authorization-success',
  templateUrl: './dialog-authorization-success.component.html',
  styleUrls: ['./dialog-authorization-success.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class DialogAuthorizationSuccessComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<DialogAuthorizationSuccessComponent>) {
  }

  ngOnInit() {

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onCloseClick();
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCloseClick() {
    this.dialogRef.close(true);
  }
}