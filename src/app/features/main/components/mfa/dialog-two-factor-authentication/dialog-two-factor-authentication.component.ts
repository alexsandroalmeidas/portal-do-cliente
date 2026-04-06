import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { MfaStoreActions, MfaStoreSelectors } from 'src/app/root-store/mfa-store';
import { AppState } from 'src/app/root-store/state';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TwoFactorEmailComponent } from './two-factor-email/two-factor-email.component';
import { TwoFactorPhoneNumberComponent } from './two-factor-phone-number/two-factor-phone-number.component';
import { TwoFactorSmsComponent } from './two-factor-sms/two-factor-sms.component';

@Component({
  templateUrl: './dialog-two-factor-authentication.component.html',
  styleUrls: ['./dialog-two-factor-authentication.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TwoFactorEmailComponent,
    TwoFactorPhoneNumberComponent,
    TwoFactorSmsComponent
  ],
})
export class DialogTwoFactorAuthenticationComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  step = 1;
  emailSelected: string = '';
  phoneNumber: string = '';
  sentVerificationCompleted = false;
  sentEmailCode = false;
  sentPhoneNumber = false;
  sentPinConfirmSms = false;
  isMfa = true;
  isVerify: boolean = false;
  isScheduled: boolean = false;

  constructor(
    protected store$: Store<AppState>,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogTwoFactorAuthenticationComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    dialogRef.disableClose = true;
    this.step = data.step;
    this.phoneNumber = data.phoneNumber;
    this.emailSelected = data.emailSelected;
    this.isMfa = data.isMfa;
    this.isVerify = !!data.isVerify;
    this.isScheduled = data.isScheduled;

    this.sentEmailCode = false;
    this.sentPhoneNumber = false;
    this.sentPinConfirmSms = false;
    this.sentVerificationCompleted = false;
  }

  ngOnInit(): void {
    this.subscribeVerifiedPinEmail();
    this.subscribePinIdSms();
    this.subscribeVerifiedPinSms();
    this.subscribeVerificationCompleted();
  }

  private subscribeVerifiedPinEmail() {
    this.store$
      .select(MfaStoreSelectors.selectVerifiedPinEmail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verifiedPinEmail: boolean) => {
        if (this.sentEmailCode) {
          if (verifiedPinEmail) {
            this.step = 2;
            this.sentEmailCode = false;
            this.store$.dispatch(new MfaStoreActions.SetVerifyPinEmailAction({ verifiedPinEmail: false }));
          } else {
            this.notificationService.showWarning("Código informado é inválido.");
          }
        }
      });
  }

  private subscribePinIdSms() {
    this.store$
      .select(MfaStoreSelectors.selectPinIdSms)
      .pipe(takeUntil(this.$unsub))
      .subscribe((pinId: string) => {
        if (this.sentPhoneNumber) {
          if (!!pinId) {
            this.step = 3;
            this.sentPhoneNumber = false;
          }
        }
      });
  }

  private subscribeVerifiedPinSms() {
    this.store$
      .select(MfaStoreSelectors.selectVerifiedPinSms)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verifiedPinSms: boolean) => {
        if (this.sentPinConfirmSms) {
          if (!!verifiedPinSms) {
            this.sentVerificationCompleted = true;
            this.sentPinConfirmSms = false;
            this.store$.dispatch(new MfaStoreActions.SetVerifyPinSmsAction({ verifiedPinSms: false }));

            if (this.isMfa) {
              this.store$.dispatch(new MfaStoreActions.VerificationCompletedAction());
            } else {
              this.dialogRef.close(true);
            }

          } else {
            this.notificationService.showWarning("Pin informado é inválido.");
          }
        }
      });
  }

  private subscribeVerificationCompleted() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verificationCompleted: boolean) => {
        if (this.sentVerificationCompleted) {
          if (verificationCompleted) {
            this.dialogRef.close(true);
          } else {
            this.notificationService.showWarning("Falha ao cadastrar telefone. Entre em contato com nossa central.");
            this.dialogRef.close();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onContinueEmailClick(pinCode: string): void {
    this.store$.dispatch(new MfaStoreActions.VerifyPinEmailAction({ pinCode }));
    this.sentEmailCode = true;
  }

  onContinuePhoneNumberClick(phoneNumber: string): void {
    this.store$.dispatch(new MfaStoreActions.SendPinSmsAction({ phoneNumber }));
    this.phoneNumber = phoneNumber;
    this.sentPhoneNumber = true;
  }

  onConfirmSmsClick(pinCode: string): void {
    this.store$.dispatch(new MfaStoreActions.VerifyPinSmsAction({ pinCode }));
    this.sentPinConfirmSms = true;
  }

  onResendSmsClick(): void {
    this.store$.dispatch(new MfaStoreActions.ResendPinSmsAction());
  }

  onResendEmailClick(): void {
    this.store$.dispatch(new MfaStoreActions.ResendPinEmailAction());
  }
}
