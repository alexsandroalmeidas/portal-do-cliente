import { OnInit, OnDestroy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  templateUrl: './mfa-reinforce-security-dialog.component.html',
  styleUrls: ['./mfa-reinforce-security-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class MfaReinforceSecurityDialogComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<MfaReinforceSecurityDialogComponent>) {
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
