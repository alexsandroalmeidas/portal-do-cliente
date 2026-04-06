import { SharedModule } from '@/shared/shared.module';
import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './dialog-unauthorized-mfa.component.html',
  styleUrls: ['./dialog-unauthorized-mfa.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogUnauthorizedMfaComponent implements OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<DialogUnauthorizedMfaComponent>) { }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onActivateClick() {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
