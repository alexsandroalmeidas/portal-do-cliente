import { OnInit, OnDestroy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    templateUrl: './mfa-cancel-dialog.component.html',
    styleUrls: ['./mfa-cancel-dialog.component.scss'],
    standalone: true,
    imports: [SharedModule],
})
export class PrepaymentsMfaCancelDialogComponent implements OnInit, OnDestroy {

    private $unsub = new Subject();

    constructor(private dialogRef: MatDialogRef<PrepaymentsMfaCancelDialogComponent>) {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.$unsub.next(false);
        this.$unsub.complete();
    }

    onContinueClick() {
        this.dialogRef.close(true);
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }
}
