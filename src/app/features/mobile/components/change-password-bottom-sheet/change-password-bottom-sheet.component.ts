import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { firstValueFrom, map, Subject, take, takeUntil } from 'rxjs';
import { AuthStoreSelectors, CoreStoreSelectors } from 'src/app/root-store';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors,
} from 'src/app/root-store/administration-store';
import {
  IdentityStoreActions,
  IdentityStoreSelectors,
} from 'src/app/root-store/identity-store';
import {
  MfaStoreActions,
  MfaStoreSelectors,
} from 'src/app/root-store/mfa-store';
import { AppState } from 'src/app/root-store/state';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';
import { ConfirmationBottomSheetComponent } from '../confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from '../mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { MfaVerificationCompletedBottomSheetComponent } from '../mfa/mfa-verification-completed-bottom-sheet/mfa-verification-completed-bottom-sheet.component';

@Component({
  selector: 'app-change-password-bottom-sheet',
  templateUrl: './change-password-bottom-sheet.component.html',
  styleUrls: ['./change-password-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelBodyDirective,
  ],
})
export class ChangePasswordBottomSheetComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  hideCurrentPwd = true;
  hideNewPwd = true;
  hideConfirmNewPwd = true;
  searchValue: string = '';
  minPw = 6;
  changePasswordForm!: FormGroup;
  isPasswordSame = false;
  newPwdIsTyping = false;
  userEmail: string = '';
  isAd = false;
  forgotPassword = false;
  isFirstAccess = false;
  economicGroupPhoneNumber = '';
  isManager = false;

  get formControls() {
    return this.changePasswordForm.controls;
  }

  constructor(
    public dialog: MatDialog,
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<ChangePasswordBottomSheetComponent>,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet,
  ) {}

  hide = true;

  verifyHasNumber(text: string) {
    const regex = /\d/;

    const doesItHaveNumber = regex.test(text);

    return doesItHaveNumber;
  }

  verifyHasLetter(text: string) {
    const regex = /[a-z]/i;
    return regex.test(text);
  }

  verifyHasSpecialChars(text: string) {
    var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    return regex.test(text);
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        currentPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmNewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
      },
      {
        validator: this.checkPassword('newPassword', 'confirmNewPassword'),
      },
    );

    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub),
      )
      .subscribe((overscrolling) => {
        if (overscrolling) {
          this.onCancelClick();
        }
      });

    this.subscribeSelectIsManager();
    this.subscribeEconomicGroupPhone();
    this.subscribeAuthData();
    this.subscribeChangedPassword();
    this.subscribeChangedPasswordFailure();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();

    this.selectGetEconomicGroupPhone();
  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = matchingControl.status == 'VALID' ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = matchingControl.status == 'VALID' ? true : false;
      }
    };
  }

  private validateFieldsErrors(currentPassword: string, newPassword: string) {
    if (currentPassword.length < 6) {
      return true;
    }

    if (newPassword.length < 6) {
      return true;
    }

    if (!this.verifyHasLetter(newPassword)) {
      return true;
    }

    if (!this.verifyHasNumber(newPassword)) {
      return true;
    }

    if (!this.verifyHasSpecialChars(newPassword)) {
      return true;
    }

    if (!this.isPasswordSame) {
      return true;
    }

    return false;
  }

  private subscribeGetEconomicGroupPhoneHasError() {
    this.store$
      .select(AdministrationStoreSelectors.selectGetEconomicGroupPhoneHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(
            new AdministrationStoreActions.SetNoErrorGetEconomicGroupPhoneAction(),
          );
          this.notificationService.showError(
            'Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.',
            'Algo deu errado nesta ação',
          );
        }
      });
  }

  private subscribePinSmsHasError() {
    this.store$
      .select(MfaStoreSelectors.selectPinSmsHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new MfaStoreActions.SetNoErrorPinSmsAction());
          this.notificationService.showError(
            'Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.',
            'Algo deu errado nesta ação',
          );
        }
      });
  }

  private subscribeVerificationCompletedHasError() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompletedHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(
            new MfaStoreActions.SetNoErrorVerificationCompletedAction(),
          );
          this.notificationService.showError(
            'Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.',
            'Algo deu errado nesta ação',
          );
        }
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        if (!!authData?.user?.email) {
          const emailSplited = (authData?.user?.email).split('@');
          this.userEmail =
            `${emailSplited[0].substring(0, 3)}${'*'.repeat(emailSplited[0].length - 3)}@${
              emailSplited[1]
            }` || '';
        }
        this.isAd = authData?.isAd || false;
        this.isFirstAccess = authData?.user?.isFirstAccess || false;
        this.forgotPassword = authData?.user?.forgotPassword || false;
      });
  }

  private subscribeChangedPassword() {
    this.store$
      .select(IdentityStoreSelectors.selectChangedPassword)
      .pipe(takeUntil(this.$unsub))
      .subscribe((changedPassword: boolean) => {
        if (changedPassword) {
          this.store$.dispatch(
            new IdentityStoreActions.ChangedPasswordAction(),
          );
          this.notificationService.showSuccess(
            'Sua senha foi definida com sucesso para acessar ao Portal e APP Petlove',
          );
          this.bottomSheetRef.dismiss(true);
        }
      });
  }

  private subscribeChangedPasswordFailure() {
    this.store$
      .select(IdentityStoreSelectors.selectChangedPasswordFailure)
      .pipe(takeUntil(this.$unsub))
      .subscribe((changedPasswordError: string) => {
        if (!!changedPasswordError) {
          this.notificationService.showError(changedPasswordError);
        }
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupPhoneAction(),
    );
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private subscribeSelectIsManager() {
    this.store$
      .select(AdministrationStoreSelectors.selectIsManager)
      .pipe(takeUntil(this.$unsub))
      .subscribe((isManager: boolean) => {
        this.isManager = isManager;
      });
  }

  onSaveClick() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const { currentPassword, confirmNewPassword } =
      this.changePasswordForm.value;

    if (this.validateFieldsErrors(currentPassword, confirmNewPassword)) {
      return;
    }

    if (!this.isManager) {
      this.openMfaTwoFactorAuthenticationBottomSheet(0);
    } else {
      this.changePassword();
    }
  }

  async openMfaTwoFactorAuthenticationBottomSheet(step: number) {
    if (step === 0) {
      if (!!this.economicGroupPhoneNumber) {
        // enviar pin por sms
        this.store$.dispatch(
          new MfaStoreActions.SendPinSmsAction({
            phoneNumber: this.economicGroupPhoneNumber,
          }),
        );
        step = 3;
      } else {
        this.store$.dispatch(new MfaStoreActions.SendPinEmailAction());
        step = 1;
      }
    }

    const dialogTwoFactorRef = this.bottomSheet.open(
      MfaTwoFactorAuthenticationBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: step,
          emailSelected: this.userEmail,
          isMfa: step === 1,
          isVerify: true,
          isActivation: true,
        },
      },
    );

    dialogTwoFactorRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {
        if (data === true) {
          this.openMfaVerificationCompletedBottomSheet();
        } else if (data === false) {
          await this.openMfaCancelDialog(() =>
            this.openMfaTwoFactorAuthenticationBottomSheet(step),
          );
        }
      });
  }

  openMfaVerificationCompletedBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(
      MfaVerificationCompletedBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {
        this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
        this.store$.dispatch(new MfaStoreActions.VerificationCompletedAction());

        this.changePassword();
      });
  }

  private changePassword() {
    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.store$.dispatch(
      new IdentityStoreActions.ChangePasswordAction({
        currentPassword: currentPassword,
        newPassword,
      }),
    );
  }

  async openMfaCancelDialog(callback: () => Promise<void>) {
    if (!(await this.confirmCancelMfa())) {
      await callback();
    }
  }

  confirmCancelMfa() {
    const dialogTwoFactorRef = this.bottomSheet.open(
      ConfirmationBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          title:
            'Atenção! Você tem certeza que deseja cancelar a ativação da autenticação de 2 fatores?',
          description:
            'O cancelamento da autenticação de 2 fatores (MFA) impede que você conclua suas transações.',
          okText: 'Sim, desejo cancelar',
          cancelText: 'Voltar',
        },
      },
    );

    return firstValueFrom(
      dialogTwoFactorRef.afterDismissed().pipe(
        take(1),
        map((confirm) => !!confirm),
      ),
    );
  }

  openChangePasswordBottomSheet() {
    const changePasswordBottomSheet = this.bottomSheet.open(
      ChangePasswordBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
      },
    );

    changePasswordBottomSheet
      .afterDismissed()
      .pipe(take(1))
      .subscribe(async (data) => {});
  }

  onCancelClick(): void {
    this.store$.dispatch(new IdentityStoreActions.ChangedPasswordAction());
    this.bottomSheetRef.dismiss(false);
  }

  applyFilter(event: any) {
    console.log(event.target.value);
  }
}
