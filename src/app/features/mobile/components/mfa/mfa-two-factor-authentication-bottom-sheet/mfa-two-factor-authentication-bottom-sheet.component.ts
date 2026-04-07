import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import { AppState } from '@/root-store/state';
import { NotificationService } from '@/shared/services/notification.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetPanelBodyDirective } from '../../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelComponent } from '../../bottom-sheet-panel/bottom-sheet-panel.component';
import { MfaTwoFactorEmailComponent } from './mfa-two-factor-email/mfa-two-factor-email.component';
import { MfaTwoFactorPhoneNumberComponent } from './mfa-two-factor-phone-number/mfa-two-factor-phone-number.component';
import { MfaTwoFactorSmsComponent } from './mfa-two-factor-sms/mfa-two-factor-sms.component';

@Component({
  templateUrl: './mfa-two-factor-authentication-bottom-sheet.component.html',
  styleUrls: ['./mfa-two-factor-authentication-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MfaTwoFactorEmailComponent,
    MfaTwoFactorPhoneNumberComponent,
    MfaTwoFactorSmsComponent,
    BottomSheetPanelComponent,
    BottomSheetPanelBodyDirective
  ],
})
export class MfaTwoFactorAuthenticationBottomSheetComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  step = 1;
  email: string = '';
  phoneNumber: string = '';
  codeError = null as any;
  sentVerificationCompleted = false;
  sentEmailCode = false;
  sentPinConfirmSms = false;
  sentPhoneNumber = false;
  isMfa = true;
  isVerify = false;
  isActivation = false;
  isScheduled = false;

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private bottomSheetRef: MatBottomSheetRef<MfaTwoFactorAuthenticationBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      step: number,
      email: string,
      isMfa: boolean,
      isActivation: boolean,
      isScheduled: boolean
    }) {

    this.step = data.step;
    this.email = data.email;
    this.isMfa = data.isMfa;
    this.isActivation = data.isActivation;
    this.isScheduled = data.isScheduled;

    this.sentEmailCode = false;
    this.sentPhoneNumber = false;
    this.sentPinConfirmSms = false;
    this.sentVerificationCompleted = false;
  }

  ngOnInit(): void {
    this.selectVerifiedPinEmail();
    this.selectPinIdSms();
    this.selectVerifiedPinSms();
    this.selectVerificationCompleted();
  }

  selectVerifiedPinEmail() {
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

  selectPinIdSms() {
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

  selectVerifiedPinSms() {
    this.store$
      .select(MfaStoreSelectors.selectVerifiedPinSms)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verifiedPinSms: boolean) => {
        if (this.sentPinConfirmSms) {
          if (!!verifiedPinSms) {
            this.codeError = null;
            this.sentVerificationCompleted = true;
            this.sentPinConfirmSms = false;
            this.store$.dispatch(new MfaStoreActions.SetVerifyPinSmsAction({ verifiedPinSms: false }));

            if (this.isMfa) {
              this.store$.dispatch(new MfaStoreActions.VerificationCompletedAction());
            } else {
              this.bottomSheetRef.dismiss(true);
            }

          } else {
            this.codeError = 'Pin informado é inválido.';
          }
        }
      });
  }

  selectVerificationCompleted() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompleted)
      .pipe(takeUntil(this.$unsub))
      .subscribe((verificationCompleted: boolean) => {
        if (this.sentVerificationCompleted) {
          if (verificationCompleted) {
            this.bottomSheetRef.dismiss(true);
          } else {
            this.notificationService.showWarning("Falha ao cadastrar telefone. Entre em contato com nossa central.");
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onStartActivation() {
    this.step = 1;
  }

  onCancelClick(): void {
    this.bottomSheetRef.dismiss(false);
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
