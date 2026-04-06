import { OnInit, OnDestroy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  templateUrl: './dialog-reinforce-security.component.html',
  styleUrls: ['./dialog-reinforce-security.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogReinforceSecurityComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  constructor(private dialogRef: MatDialogRef<DialogReinforceSecurityComponent>) {
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
