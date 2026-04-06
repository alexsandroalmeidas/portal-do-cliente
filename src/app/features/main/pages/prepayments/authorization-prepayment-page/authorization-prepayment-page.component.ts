import { AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { AdministrationStoreActions, AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { IdentityStoreSelectors } from 'src/app/root-store/identity-store';
import { MfaStoreActions, MfaStoreSelectors } from 'src/app/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from 'src/app/root-store/prepayments-store';
import { AppState } from 'src/app/root-store/state';
import { Slide } from 'src/app/shared/components/banner-carousel/slide';
import { SelectOption } from 'src/app/shared/models/select-options';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogCancelComponent } from '../../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { SelectEstablishmentsComponent } from '../../../components/select-establishments/select-establishments.component';
import { BasePage } from '../../base.page';
import { DialogAuthorizationCancelComponent } from '../dialog-authorization-cancel/dialog-authorization-cancel.component';
import { DialogAuthorizationSuccessComponent } from '../dialog-authorization-success/dialog-authorization-success.component';

@Component({
  selector: 'app-authorization-prepayment-page',
  templateUrl: './authorization-prepayment-page.component.html',
  styleUrls: ['./authorization-prepayment-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    SelectEstablishmentsComponent
  ],
})
export class AuthorizationPrepaymentPageComponent extends BasePage implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  establishmentsToSelect: SelectOption[] = [];
  economicGroupPhoneNumber = '';
  hasAuthorization = false;
  sentAuthorization = false;
  hasAuthorizationPermission = false;
  slides: Slide[] = [];
  panelOpenState = true;
  step = 0;

  constructor(
    store$: Store<AppState>,
    private route: ActivatedRoute,
    navigationService: NavigationService,
    private notifcationService: NotificationService,
    public dialog: MatDialog) {

    super(store$, navigationService);

    this.subscribeAuthorizationPrepaymentPermission();
    this.selectGetEconomicGroupPhone();
  }

  ngAfterContentInit(): void {
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
          uid: this.prepaymentEstablishmentsSelected
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
          isMfa: false
        }
      })
      .afterClosed()
      .subscribe(data => {

        if (data === true) {

          if (this.sentAuthorization) {
            this.store$.dispatch(new PrepaymentsStoreActions.AuthorizeAction({ uid: this.prepaymentEstablishmentsSelected }));
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
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogSuccessRef = this.dialog.open(DialogAuthorizationCancelComponent, config);

    dialogSuccessRef
      .afterClosed()
      .subscribe((keep) => {
        if (keep === true) {
          this.hasAuthorization = true;
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
        }
      }
      );
  }
}
