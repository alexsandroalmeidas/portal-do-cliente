import { AdministrationStoreActions, AdministrationStoreSelectors } from '@/root-store/administration-store';
import { IdentityStoreSelectors } from '@/root-store/identity-store';
import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from '@/root-store/prepayments-store';
import { AppState } from '@/root-store/state';
import { Slide } from '@/shared/components/banner-carousel/slide';
import { SelectOption } from '@/shared/models/select-options';
import { NotificationService } from '@/shared/services/notification.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CheckMarkedComponent } from '../../../components/check-marked/check-marked.component';
import { DialogCancelComponent } from '../../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { DialogAuthorizationCancelComponent } from '../dialog-authorization-cancel/dialog-authorization-cancel.component';
import { DialogAuthorizationSuccessComponent } from '../dialog-authorization-success/dialog-authorization-success.component';

@Component({
  selector: 'dialog-authorization-prepayment',
  templateUrl: './dialog-authorization-prepayment.component.html',
  styleUrls: ['./dialog-authorization-prepayment.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CheckMarkedComponent
  ],
})
export class DialogAuthorizationPrepaymentComponent implements OnInit, OnDestroy, OnChanges {

  private $unsub = new Subject();

  establishmentsToSelect: SelectOption[] = [];
  economicGroupPhoneNumber = '';
  hasAuthorization = false;
  sentAuthorization = false;
  hasAuthorizationPermission = false;
  slides: Slide[] = [];
  panelOpenState = true;
  step = 0;
  establishmentSelected!: SelectOption;

  constructor(
    private store$: Store<AppState>,
    private notifcationService: NotificationService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogAuthorizationPrepaymentComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.establishmentSelected = data.establishmentSelected;

    this.subscribeAuthorizationPrepaymentPermission();
    this.selectGetEconomicGroupPhone();
  }

  ngOnChanges(changes: SimpleChanges) {
    const itens: string = changes['prepaymentEstablishmentsSelected'].currentValue;

    this.selectGetAuthorization();
  }

  ngOnInit() {
    this.subscribeAuthorizationPrepaymentPermission();
    this.subscribeEconomicGroupPhone();
    this.subscribeAuthorization();
    this.subscribeAuthorized();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  private subscribeAuthorizationPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectAuthorizationPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorizationPermission: boolean) => {
        this.hasAuthorizationPermission = authorizationPermission || false;
      });
  }

  private subscribeGetEconomicGroupPhoneHasError() {
    this.store$
      .select(AdministrationStoreSelectors.selectGetEconomicGroupPhoneHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new AdministrationStoreActions.SetNoErrorGetEconomicGroupPhoneAction());
          this.notifcationService.showError("Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.", "Algo deu errado nesta ação");
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
          this.notifcationService.showError("Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.", "Algo deu errado nesta ação");
        }
      });
  }

  private subscribeVerificationCompletedHasError() {
    this.store$
      .select(MfaStoreSelectors.selectVerificationCompletedHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(new MfaStoreActions.SetNoErrorVerificationCompletedAction());
          this.notifcationService.showError("Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.", "Algo deu errado nesta ação");
        }
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(new AdministrationStoreActions.GetEconomicGroupPhoneAction());
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private subscribeAuthorization() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectAuthorization)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorization) => {
        this.hasAuthorization = authorization || false;
        this.panelOpenState = !this.hasAuthorization;
      });
  }

  private subscribeAuthorized() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectAuthorized)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorized) => {

        if (this.sentAuthorization) {
          if (authorized) {
            this.openAuthorizationSuccessDialog();
          }
        }
      });
  }

  private selectGetAuthorization() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.GetAuthorizationAction(
        {
          uid: this.establishmentSelected.value
        }));
  }

  openMfaTwoFactorAuthenticationDialog() {
    this.store$.dispatch(new MfaStoreActions.SendPinSmsAction({ phoneNumber: this.economicGroupPhoneNumber }));

    this.dialog
      .open(DialogTwoFactorAuthenticationComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: 3,
          isMfa: false,
          isVerify: true,
          phoneNumber: this.economicGroupPhoneNumber
        }
      })
      .afterClosed()
      .subscribe(data => {

        if (data === true) {
          if (this.sentAuthorization) {
            this.store$.dispatch(new PrepaymentsStoreActions.AuthorizeAction({ uid: this.establishmentSelected.value }));
          }
        } else if (data === false) {
          this.openMfaCancelDialog();
        }
      });
  }

  openMfaCancelDialog() {
    this.dialog
      .open(DialogCancelComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe(data => {
        if (!data) {
          this.openMfaTwoFactorAuthenticationDialog();
        }
      });
  }

  async onChangeAuthorize(event: any) {

    if (event.checked) {
      this.sentAuthorization = true;
      this.openMfaTwoFactorAuthenticationDialog();
    } else {
      this.openAuthorizationCancelDialog();
    }
  }

  async openAuthorizationCancelDialog() {

    const config: MatDialogConfig = {
      width: '30%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogSuccessRef = this.dialog.open(DialogAuthorizationCancelComponent, config);

    dialogSuccessRef
      .afterClosed()
      .subscribe((keep) => {
        if (keep === true) {
          this.hasAuthorization = true;
          this.onCloseClick();
        } else if (keep === false) {
          this.openMfaTwoFactorAuthenticationDialog();
        }
      });
  }

  async openAuthorizationSuccessDialog() {

    const config: MatDialogConfig = {
      width: '26%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogSuccessRef = this.dialog.open(DialogAuthorizationSuccessComponent, config);

    dialogSuccessRef
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.store$.dispatch(new PrepaymentsStoreActions.SetAuthorizedAction());
          this.hasAuthorization = true;
          this.onCloseClick();
        }
      }
      );
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }
}
