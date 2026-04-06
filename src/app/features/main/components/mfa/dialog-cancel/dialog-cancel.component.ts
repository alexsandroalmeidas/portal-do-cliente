import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  templateUrl: './dialog-cancel.component.html',
  styleUrls: ['./dialog-cancel.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogCancelComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<DialogCancelComponent>) {
  }

  ngOnInit(): void {

  }

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
