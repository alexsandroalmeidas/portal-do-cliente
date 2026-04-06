import { SharedModule } from '@/shared/shared.module';
import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './dialog-verification-completed.component.html',
  styleUrls: ['./dialog-verification-completed.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogVerificationCompletedComponent implements OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<DialogVerificationCompletedComponent>) { }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }
}
