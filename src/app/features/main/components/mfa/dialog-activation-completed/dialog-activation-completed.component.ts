import { SharedModule } from '@/shared/shared.module';
import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './dialog-activation-completed.component.html',
  styleUrls: ['./dialog-activation-completed.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogActivationCompletedComponent implements OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<DialogActivationCompletedComponent>) { }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

  onCompletedClick() {
    this.dialogRef.close(true);
  }
}
