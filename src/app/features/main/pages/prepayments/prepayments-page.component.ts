import { environment } from '@/environments/environment';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors,
} from '@/root-store/administration-store';
import {
  EconomicGroupRateResponse,
  EconomicGroupRatesResponse,
} from '@/root-store/administration-store/administration.models';
import { AuthStoreSelectors } from '@/root-store/auth-store';
import { IdentityStoreSelectors } from '@/root-store/identity-store';
import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import {
  PrepaymentsStoreActions,
  PrepaymentsStoreSelectors,
} from '@/root-store/prepayments-store';
import {
  BankingAccount,
  FinalCheck,
  FinalizeScheduledRequest,
  GetScheduledFinalizedResponse,
  ReceivablesScheduleGroupingResponse,
} from '@/root-store/prepayments-store/prepayments.models';
import { SelectOption } from '@/shared/models/select-options';
import { NavigationService } from '@/shared/services/navigation.service';
import { NotificationService } from '@/shared/services/notification.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { firstValueFrom, map, take, takeUntil } from 'rxjs';
import { DialogScheduledActiveCancelComponent } from '../../components/dialog-scheduled-active-cancel/dialog-scheduled-active-cancel.component';
import { DialogActivationCompletedComponent } from '../../components/mfa/dialog-activation-completed/dialog-activation-completed.component';
import { DialogCancelComponent } from '../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { SelectEstablishmentsComponent } from '../../components/select-establishments/select-establishments.component';
import { BasePage } from '../base.page';
import { AppState } from './../../../../root-store/state';
import { SharedModule } from './../../../../shared/shared.module';
import { CardPrepaymentsPunctualComponent } from './card-prepayments-punctual/card-prepayments-punctual.component';
import { CardPrepaymentsScheduledComponent } from './card-prepayments-scheduled/card-prepayments-scheduled.component';
import { DialogAuthorizationPrepaymentComponent } from './dialog-authorization-prepayment/dialog-authorization-prepayment.component';
import { DialogScheduledCancelComponent } from './dialog-scheduled-cancel/dialog-scheduled-cancel.component';
import { DialogScheduledFinalCheckComponent } from './dialog-scheduled-final-check/dialog-scheduled-final-check.component';
import { DialogScheduledSuccessComponent } from './dialog-scheduled-success/dialog-scheduled-success.component';
import { DialogUnauthorizedMfaComponent } from './dialog-unauthorized-mfa/dialog-unauthorized-mfa.component';
import { HistoricPrepaymentPageComponent } from './historic-prepayment-page/historic-prepayment-page.component';

@Component({
  templateUrl: './prepayments-page.component.html',
  styleUrls: ['./prepayments-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    SelectEstablishmentsComponent,
    CardPrepaymentsScheduledComponent,
    CardPrepaymentsPunctualComponent,
    HistoricPrepaymentPageComponent,
  ],
})
export class PrepaymentsPageComponent
  extends BasePage
  implements OnInit, OnDestroy, AfterViewInit
{
  scheduledFinalized: GetScheduledFinalizedResponse = {
    id: null as any,
  } as GetScheduledFinalizedResponse;
  prepaymentsEstablishments: string[] = [];
  prepaymentEstablishmentsSelected: string = null as any;
  receivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  bankingAccounts: BankingAccount[] = [];
  filteredReceivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  scheduledRate = 0;
  punctualRate = 0;
  hasScheduledPermission = false;
  hasAuthorizationPermission = false;
  economicGroupPhoneNumber = '';
  editCanceled = false;
  canceledScheduled = false;
  establishmentsToSelect: SelectOption[] = [];
  finalCheck: FinalCheck = {} as FinalCheck;
  isEdit = false;
  maxLimit = 0;
  minLimit = 0;
  userEmail: string = '';
  emailSelected: string = '';
  hasPermissionMfa = false;
  isD1 = false;

  get totalAvailableAmountPrepayment() {
    return !isEmpty(this.filteredReceivablesSchedule)
      ? (this.filteredReceivablesSchedule
          .filter(
            (p) => p.documentNumber === this.prepaymentEstablishmentsSelected,
          )
          ?.sumBy((p) => p.availableValue ?? 0) ?? 0)
      : 0;
  }

  get totalAmountPrepayment() {
    return !isEmpty(this.filteredReceivablesSchedule)
      ? this.filteredReceivablesSchedule.sumBy((p) => p.totalValue ?? 0)
      : 0;
  }

  get hasPrepaymentsEstablishmentsSelected() {
    return !isEmpty(this.prepaymentEstablishmentsSelected);
  }

  get hasPermission() {
    return (
      this.hasPunctualPermission &&
      this.hasScheduledPermission &&
      this.hasAuthorizationPermission
    );
  }

  get finalized() {
    return !!this.scheduledFinalized && !!this.scheduledFinalized.id;
  }

  get period() {
    if (!isEmpty(this.scheduledFinalized)) {
      if (!isEmpty(this.scheduledFinalized.daysOfWeek)) {
        const dayName = new Array(
          'Domingo',
          'Segunda',
          'Terça',
          'Quarta',
          'Quinta',
          'Sexta',
          'Sábado',
        );

        if (this.scheduledFinalized.daysOfWeek.length === 1) {
          return dayName[this.scheduledFinalized.daysOfWeek[0]];
        } else {
          const listOrdered = this.scheduledFinalized.daysOfWeek.sortBy(
            (x) => x,
          );
          return `${dayName[listOrdered[0]]} - ${dayName[listOrdered[1]]}`;
        }
      }

      if (!isEmpty(this.scheduledFinalized.daysOfMonth)) {
        if (this.scheduledFinalized.daysOfMonth.length === 1) {
          return this.scheduledFinalized.daysOfMonth[0];
        } else {
          const listOrdered = this.scheduledFinalized.daysOfMonth.sortBy(
            (x) => x,
          );

          return `${listOrdered[0]} e ${listOrdered[1]}`;
        }
      }
    }

    return '';
  }

  get prepaymentsAvailable() {
    return !isEmpty(this.receivablesSchedule)
      ? (this.receivablesSchedule?.some((p) => p.available ?? false) ?? false)
      : false;
  }

  get hasMfa() {
    return true;

    if (environment.debug) {
      return true;
    }

    return (
      (!isEmpty(this.selectedEstablishments) &&
        this.selectedEstablishments.some((x) => x.activeMfa)) ||
      this.verificationCompleted
    );
  }

  get establishmentSelected() {
    const establishmentSelected = this.establishmentsToSelect.filter(
      (p) => p.value === this.prepaymentEstablishmentsSelected,
    );

    if (!!establishmentSelected) {
      return establishmentSelected[0];
    }

    return null;
  }

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    private notifcationService: NotificationService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    super(store$, navigationService);

    this.subscribeEstablishmentsToSelect();
    this.subscribeAuthorizationPrepaymentPermission();
    this.subscribeScheduledPrepaymentPermission();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.subscribeMfaPermission();

    if (this.hasMfa) {
      this.selectGetEconomicGroupPhone();
    }

    this.subscribeAuthorizationPrepaymentPermission();
    this.subscribeScheduledPrepaymentPermission();

    this.verifyEstablishmentSelected();

    this.subscribeScheduledPrepaymentHasError();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();

    this.subscribePunctualRate();
    this.subscribeScheduledRate();
    this.subscribeBankingAccounts();

    this.subscribeReceivablesSchedule();
    this.subscribeScheduledFinalizedPrepayment();
    this.subscribeEconomicGroupPhone();
    this.subscribeCanceledScheduledPrepayment();
    this.subscribeFinalizedScheduledPrepayment();

    this.subscribeEconomicGroupRates();

    this.allSelects();
  }

  private allSelects() {
    if (this.hasMfa) {
      this.selectGetReceivablesSchedule();
      this.selectGetBankingAccount();
      this.selectGetPunctualRate();
      this.selectGetScheduledRate();
      this.selectGetScheduledFinalized();
      this.selectGetEconomicGroupRates();
    }
  }

  private selectGetEconomicGroupRates() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupRatesAction({
          uid: this.prepaymentEstablishmentsSelected,
        }),
      );
    }
  }

  private subscribeEconomicGroupRates() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupRates)
      .pipe(takeUntil(this.$unsub))
      .subscribe((economicGroupRates: EconomicGroupRatesResponse) => {
        if (!!economicGroupRates) {
          const rate: EconomicGroupRateResponse =
            economicGroupRates?.rates.firstOrDefault((x) => !!x);
          this.isD1 = rate.prepaidDebitPeriod === 1;
        }
      });
  }

  private subscribeMfaPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectMfaPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((permissionMfa: boolean) => {
        this.hasPermissionMfa = permissionMfa;

        console.log('this.verificationCompleted', this.verificationCompleted);

        if (this.hasPermissionMfa && !this.verificationCompleted) {
          if (
            !isEmpty(this.selectedEstablishments) &&
            this.selectedEstablishments.some((x) => !x.activeMfa)
          ) {
            // this.openDialogUnauthorizedMfa();
          }
        }
      });
  }

  private subscribeEstablishmentsToSelect() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        if (!!establishments) {
          this.establishmentsToSelect = [
            ...establishments.map(
              (establishment) =>
                new SelectOption(
                  `${establishment.companyName} - ${establishment.documentNumber}`,
                  establishment.uid,
                ),
            ),
          ];
        }
      });
  }

  private subscribeCanceledScheduledPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectCanceledScheduledPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((canceledScheduled) => {
        this.canceledScheduled = canceledScheduled;

        if (canceledScheduled) {
          this.store$.dispatch(
            new PrepaymentsStoreActions.SetCanceledScheduledPrepaymentAction(),
          );

          if (this.isEdit) {
            this.isEdit = false;
            this.selectFinalizeScheduledPrepayment();
          } else {
            this.editCanceled = false;
            // this.onOpenScheduledCancelDialog();
            this.selectGetScheduledFinalized();
          }
        }
      });
  }

  private subscribeScheduledFinalizedPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledFinalizedPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledFinalized) => {
        this.scheduledFinalized = scheduledFinalized;
      });
  }

  private subscribeScheduledPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectScheduledPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledPermission: boolean) => {
        this.hasScheduledPermission = scheduledPermission || false;
      });
  }

  private subscribeAuthorizationPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectAuthorizationPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authorizationPermission: boolean) => {
        this.hasAuthorizationPermission = authorizationPermission || false;
      });
  }

  private subscribeReceivablesSchedule() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectReceivablesScheduleGrouping)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesSchedule) => {
        this.receivablesSchedule = receivablesSchedule || [];

        if (!isEmpty(this.receivablesSchedule)) {
          this.receivablesSchedule.map((p) =>
            this.prepaymentsEstablishments.push(p.documentNumber),
          );
          this.filteredReceivablesSchedule = [...this.receivablesSchedule];
        }
      });
  }

  private subscribePunctualRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectPunctualRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        this.punctualRate = prepaymentRate?.rate ?? 0;
      });
  }

  private subscribeScheduledRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        this.scheduledRate = prepaymentRate?.rate ?? 0;
        this.maxLimit = prepaymentRate?.maxLimit ?? 0;
        this.minLimit = prepaymentRate?.minLimit ?? 0;
      });
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        if (!!authData?.user?.email) {
          this.emailSelected = authData?.user?.email;
          const emailSplited = this.emailSelected.split('@');
          this.userEmail =
            `${emailSplited[0].substring(0, 3)}${'*'.repeat(emailSplited[0].length - 3)}@${
              emailSplited[1]
            }` || '';
        }
      });
  }

  private subscribeScheduledPrepaymentHasError() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledPrepaymentHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error && error !== 'No active contracts') {
          this.store$.dispatch(
            new PrepaymentsStoreActions.SetNoErrorScheduledPrepaymentAction(),
          );
          this.notifcationService.showError(
            'Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.',
            'Algo deu errado nesta ação',
          );
        }
      });
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
          this.notifcationService.showError(
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

          this.notifcationService.showError(
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
          this.notifcationService.showError(
            'Por favor, tente novamente mais tarde ou entre em contato com nossa equipe de suporte.',
            'Algo deu errado nesta ação',
          );
        }
      });
  }

  private subscribeBankingAccounts() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bankingAccounts) => {
        this.bankingAccounts = bankingAccounts || [];
      });
  }

  private subscribeFinalizedScheduledPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectFinalizedScheduledPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((finalized) => {
        if (finalized) {
          this.openScheduledSuccessDialog();
        }
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupPhoneAction(),
    );
  }

  private selectGetScheduledFinalized() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetScheduledFinalizedAction({
          uid: this.prepaymentEstablishmentsSelected,
        }),
      );
    }
  }

  private selectGetReceivablesSchedule() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetReceivablesScheduleGroupingAction({
          uid: this.prepaymentEstablishmentsSelected,
        }),
      );
    }
  }

  private selectGetBankingAccount() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetBankingAccountPrepaymentAction({
          uid: this.prepaymentEstablishmentsSelected,
        }),
      );
    }
  }

  private selectGetPunctualRate() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetPunctualRatePrepaymentAction({
          uid: this.prepaymentEstablishmentsSelected,
          prepaymentTotalAmount: this.totalAvailableAmountPrepayment,
        }),
      );
    }
  }

  private selectGetScheduledRate() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetScheduledRatePrepaymentAction({
          uid: this.prepaymentEstablishmentsSelected,
          prepaymentTotalAmount: this.totalAvailableAmountPrepayment,
        }),
      );
    }
  }

  private selectCancelScheduledPrepayment() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.CancelScheduledPrepaymentAction({
          id: this.scheduledFinalized.id,
          uid: this.prepaymentEstablishmentsSelected,
        }),
      );
    }
  }

  private selectFinalizeScheduledPrepayment() {
    const request = {
      uid: this.prepaymentEstablishmentsSelected,
      rate: this.scheduledRate,
      maxLimit: this.maxLimit,
      minLimit: this.minLimit,
      frequency: this.finalCheck.frequency,
      daysOfWeek: this.finalCheck.daysOfWeek,
      daysOfMonth: this.finalCheck.daysOfMonth,
    } as FinalizeScheduledRequest;

    this.store$.dispatch(
      new PrepaymentsStoreActions.FinalizeScheduledPrepaymentAction({
        request,
      }),
    );
  }

  async onOpenFinalCheckDetail(finalCheck: FinalCheck) {
    this.finalCheck = finalCheck;

    const config: MatDialogConfig = {
      width: '60vh',
      hasBackdrop: true,
      disableClose: true,
      data: {
        scheduledMode: finalCheck.viewMode,
        selection: finalCheck.selectionDescription,
        bankingAccount: await this.getBankingAccount(),
        rate: this.scheduledRate,
      },
    };

    const dialogFinalRef = this.dialog.open(
      DialogScheduledFinalCheckComponent,
      config,
    );

    dialogFinalRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm === true) {
        this.openMfaTwoFactorAuthenticationDialog();
      }
      if (confirm === false) {
        this.onOpenScheduledCancelDialog();
      }
    });
  }

  onSelectedEstablishmentsClick(event: any) {
    this.prepaymentEstablishmentsSelected = event;
    this.verifyEstablishmentSelected();
    this.allSelects();
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();

    this.allSelects();
  }

  async getBankingAccount() {
    if (!isEmpty(this.bankingAccounts)) {
      console.log('Array:', this.bankingAccounts);
      console.log('Tipo:', typeof this.bankingAccounts);
      console.log('É Array?', Array.isArray(this.bankingAccounts));

      var selectedDoc = this.selectedEstablishments.filter(
        (x) => x.uid == this.prepaymentEstablishmentsSelected,
      );

      const resultado = this.bankingAccounts.some(
        (b: any) => b.documentNumber === selectedDoc[0].documentNumber,
      );
      console.log('Resultado:', resultado);

      return this.bankingAccounts
        .filter(
          (b: any) =>
            b.documentNumber === this.selectedEstablishments[0].documentNumber,
        )
        .firstOrDefault((x: BankingAccount) => !!x);
    }

    return {} as BankingAccount;
  }

  private verifyEstablishmentSelected() {
    if (!this.prepaymentEstablishmentsSelected) {
      this.prepaymentEstablishmentsSelected =
        this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);
    } else {
      if (
        !isEmpty(this.selectedEstablishmentsUids) &&
        this.selectedEstablishmentsUids.length === 1
      ) {
        const firstEstablishment: string =
          this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);

        if (firstEstablishment !== this.prepaymentEstablishmentsSelected) {
          this.prepaymentEstablishmentsSelected = firstEstablishment;
        }
      }
    }
  }

  openMfaTwoFactorAuthenticationDialog(isVerify: boolean = false) {
    this.store$.dispatch(
      new MfaStoreActions.SendPinSmsAction({
        phoneNumber: this.economicGroupPhoneNumber,
      }),
    );

    this.dialog
      .open(DialogTwoFactorAuthenticationComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step: 3,
          isMfa: false,
          isVerify,
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data === true) {
          if (this.isEdit || this.editCanceled) {
            this.selectCancelScheduledPrepayment();
          } else {
            this.selectFinalizeScheduledPrepayment();
          }
        } else if (data === false && !isVerify) {
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
      .subscribe((data) => {
        if (!data) {
          this.openMfaTwoFactorAuthenticationDialog();
        }
      });
  }

  async openScheduledSuccessDialog() {
    const config: MatDialogConfig = {
      width: '26%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogSuccessRef = this.dialog.open(
      DialogScheduledSuccessComponent,
      config,
    );

    dialogSuccessRef.afterClosed().subscribe((concluido) => {
      if (concluido) {
        this.store$.dispatch(
          new PrepaymentsStoreActions.FinalizedScheduledPrepaymentAction(),
        );
        this.selectGetScheduledFinalized();
      }
    });
  }

  async onEditClick() {
    this.isEdit = true;
    this.onActivateClick();
  }

  openDialogUnauthorizedMfa() {
    this.dialog
      .open(DialogUnauthorizedMfaComponent, {
        hasBackdrop: false,
        disableClose: true,
        width: '392px',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.openDialogTwoFactor(true, 1);
        } else {
          if (!environment.debug) {
            this.goToSummary();
          }
        }
      });
  }

  async openDialogTwoFactor(isActivation: boolean, step: number) {
    // enviar pin por email
    this.store$.dispatch(new MfaStoreActions.SendPinEmailAction());

    this.dialog
      .open(DialogTwoFactorAuthenticationComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
        data: {
          step,
          emailSelected: this.userEmail,
          isMfa: true,
          isActivation,
        },
      })
      .afterClosed()
      .subscribe(async (data) => {
        switch (data) {
          case true: {
            this.openVerificationCompletedDialog();
            break;
          }
          case false: {
            if (!(await this.confirmCancelMfa())) {
              this.openDialogTwoFactor(isActivation, step);
            }
            break;
          }
        }
      });
  }

  confirmCancelMfa() {
    return firstValueFrom(
      this.dialog
        .open(DialogCancelComponent, {
          width: '392px',
          hasBackdrop: true,
          disableClose: true,
        })
        .afterClosed()
        .pipe(
          take(1),
          map((confirm) => !!confirm),
        ),
    );
  }

  openVerificationCompletedDialog() {
    this.dialog
      .open(DialogActivationCompletedComponent, {
        width: '392px',
        hasBackdrop: true,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.store$.dispatch(new MfaStoreActions.VerifiedMfaAction());
        }
      });
  }

  async onOpenScheduledCancelDialog() {
    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogScheduleCancelRef = this.dialog.open(
      DialogScheduledCancelComponent,
      config,
    );

    dialogScheduleCancelRef.afterClosed().subscribe((confirm) => {
      if (!confirm) {
        this.selectGetScheduledFinalized();
      }
    });
  }

  async onCancelClick() {
    const config: MatDialogConfig = {
      width: '26%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogScheduleActiveRef = this.dialog.open(
      DialogScheduledActiveCancelComponent,
      config,
    );

    dialogScheduleActiveRef.afterClosed().subscribe((keep) => {
      if (keep === false) {
        this.editCanceled = true;
        this.openMfaTwoFactorAuthenticationDialog(true);
      }
    });
  }

  async onActivateClick() {
    await this.router.navigate(['/prepayments-scheduled'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async onRequestClick() {
    await this.router.navigate(['/prepayments-punctual'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async onHistoricClick() {
    await this.router.navigate(['/prepayments-historic'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async goToSummary() {
    await this.router.navigate(['/summary'], {});
  }

  async openAuthorizationDialog() {
    const config: MatDialogConfig = {
      width: '40%',
      hasBackdrop: true,
      disableClose: true,
      data: {
        establishmentSelected: this.establishmentSelected,
      },
    };

    const dialogCancelRef = this.dialog.open(
      DialogAuthorizationPrepaymentComponent,
      config,
    );

    dialogCancelRef.afterClosed().subscribe((data) => {
      if (data) {
      }
    });
  }
}
