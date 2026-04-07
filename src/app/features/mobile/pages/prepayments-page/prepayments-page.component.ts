import { environment as env } from '@/environments/environment';
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
  GetScheduledFinalizedResponse,
  ReceivablesScheduleGroupingResponse,
} from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { firstValueFrom, map, take, takeUntil } from 'rxjs';
import { ConfirmationBottomSheetComponent } from '../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { EstablishmentSelectDialogComponent } from '../../components/establishment-select-dialog/establishment-select-dialog.component';
import { FunctionalityUnavailableCardComponent } from '../../components/functionality-unavailable-card/functionality-unavailable-card.component';
import { MfaActivationCompletedBottomSheetComponent } from '../../components/mfa/mfa-activation-completed-bottom-sheet/mfa-activation-completed-bottom-sheet.component';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from '../../components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { ToolbarBackgroundComponent } from './../../components/toolbar-background/toolbar-background.component';
import { PrepaymentConsentDialogComponent } from './components/authorization/components/prepayment-consent-dialog/prepayment-consent-dialog.component';
import { MfaUnauthorizedDialogComponent } from './components/mfa/components/mfa-unauthorized-dialog/mfa-unauthorized-dialog.component';
import { PrepaymentsHistoryBottomSheetComponent } from './components/prepayments-history-bottom-sheet/prepayments-history-bottom-sheet.component';
import { PrepaymentPunctualCardComponent } from './components/punctual/components/punctual-card/punctual-card.component';
import { ScheduledCancelDialogComponent } from './components/scheduled/components/scheduled-cancel-dialog/scheduled-cancel-dialog.component';
import { PrepaymentScheduledCardComponent } from './components/scheduled/components/scheduled-card/scheduled-card.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    PrepaymentPunctualCardComponent,
    PrepaymentScheduledCardComponent,
    FunctionalityUnavailableCardComponent,
    ToolbarBackgroundComponent,
  ],
  templateUrl: './prepayments-page.component.html',
  styleUrls: ['./prepayments-page.component.scss'],
  host: { class: 'flex-fill' },
})
export class PrepaymentsPageComponent extends MobileBasePage {
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
  hasPermission = false;
  hasPunctualPermission = false;
  hasAuthorizationPermission = false;
  economicGroupPhoneNumber = '';
  userEmail: string = '';
  emailSelected = '';
  editCanceled = false;
  canceledScheduled = false;
  hasPermissionMfa = false;

  itemsPerSlide = 1;
  singleSlideOffset = true;
  noWrap = true;
  slides = [1, 2];

  textChange1 = '';
  textChange2 = '';

  get selectedEstablishmentName() {
    return !isEmpty(this.prepaymentEstablishmentsSelected)
      ? this.selectedEstablishments
          .filter((p) => this.prepaymentEstablishmentsSelected === p.uid)
          ?.map((p) => p.companyName)
      : null;
  }

  get hasSingleSelectedEstablishment() {
    return (
      !isEmpty(this.selectedEstablishments) &&
      (this.selectedEstablishments?.length || 0) === 1
    );
  }

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

  get finalized() {
    return !!this.scheduledFinalized && !!this.scheduledFinalized.id;
  }

  get prepaymentsAvailable() {
    return !isEmpty(this.receivablesSchedule)
      ? (this.receivablesSchedule?.some((p) => p.available ?? false) ?? false)
      : false;
  }

  get hasMfa() {
    return true;

    if (env.debug) {
      return true;
    }

    return (
      (!isEmpty(this.selectedEstablishments) &&
        this.selectedEstablishments.some((x) => x.activeMfa)) ||
      this.verificationCompleted
    );
  }

  isD1 = false;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router,
    public dialog: MatDialog,
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router,
    );

    this.subscribeAuthData();
    this.subscribeAuthorizationPrepaymentPermission();
    this.subscribePunctualPrepaymentPermission();
    this.subscribePrepaymentsPermission();
    this.subscribeMfaPermission();

    this.subscribeScheduledPrepaymentHasError();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
  }

  ngOnInit() {
    this.verifyEstablishmentSelected();

    this.subscribeReceivablesSchedule();
    this.subscribePunctualRate();
    this.subscribeScheduledRate();
    this.subscribeScheduledFinalizedPrepayment();
    this.subscribeEconomicGroupPhone();
    this.subscribeEconomicGroupRates();
    this.subscribeCanceledScheduledPrepayment();
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

    this.allSelects();
  }

  private allSelects() {
    if (
      this.hasPunctualPermission &&
      this.hasScheduledPermission &&
      this.hasAuthorizationPermission
    ) {
      if (this.hasMfa) {
        this.selectGetReceivablesSchedule();
        this.selectGetBankingAccount();
        this.selectGetPunctualRate();
        this.selectGetScheduledRate();
        this.selectGetScheduledFinalized();
        this.selectGetEconomicGroupRates();
      }
    }
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();
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

        if (this.hasPermissionMfa) {
          if (
            !isEmpty(this.selectedEstablishments) &&
            this.selectedEstablishments.some((x) => !x.activeMfa)
          ) {
            // this.openDialogUnauthorizedMfa();
          }
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
          if (!this.editCanceled) {
            this.store$.dispatch(
              new PrepaymentsStoreActions.SetCanceledScheduledPrepaymentAction(),
            );
            this.onOpenScheduledCancelDialog();
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

  private subscribePunctualPrepaymentPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPunctualPrepaymentPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((punctualPermission: boolean) => {
        this.hasPunctualPermission = punctualPermission || false;
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

  private subscribePrepaymentsPermission() {
    this.store$
      .select(IdentityStoreSelectors.selectPrepaymentsPermission)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentsPermission: boolean) => {
        this.hasPermission = prepaymentsPermission || false;
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
          this.router.navigate(['/failure/mobile']);
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
          this.router.navigate(['/failure/mobile']);
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
          this.router.navigate(['/failure/mobile']);
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
          this.router.navigate(['/failure/mobile']);
        }
      });
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

  private selectGetEconomicGroupRates() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupRatesAction({
          uid: this.prepaymentEstablishmentsSelected,
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

  async onOpenScheduledCancelDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      ScheduledCancelDialogComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (!confirm) {
          this.selectGetScheduledFinalized();
        }
      });
  }

  onSelectPrepaymentEstablishments() {
    const bottomSheetRef = this.bottomSheet.open(
      EstablishmentSelectDialogComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          establishments: this.selectedEstablishments,
          enableSelectedAllEstablishments: false,
          selectedEstablishments: [
            ...this.selectedEstablishmentsUids.filter(
              (p) => this.prepaymentEstablishmentsSelected === p,
            ),
          ],
          selectedMoreThanOne: false,
        },
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((documents: string[]) => {
        if (!!documents) {
          this.prepaymentEstablishmentsSelected = documents.firstOrDefault(
            (x) => !!x,
          );
          this.filteredReceivablesSchedule = [
            ...this.receivablesSchedule.filter(
              (p) => this.prepaymentEstablishmentsSelected === p.documentNumber,
            ),
          ];
          this.allSelects();
        }
      });
  }

  async goActivate(isEdit: boolean) {
    await this.router.navigate(['/prepayments/mobile/scheduled'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
        isEdit,
      },
    });
  }

  onEditScheduledFinalizedClick(event: any) {
    if (event === true) {
      this.editCanceled = true;
      this.goActivate(this.editCanceled);
    }
  }

  async onActivateClick() {
    await this.router.navigate(['/prepayments/mobile/scheduled'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async onRequestPunctualClick() {
    await this.router.navigate(['prepayments/mobile/punctual'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async onCancelScheduledFinalizedClick(event: any) {
    if (event === true) {
      if (await this.confirmCancelScheduledFinalized()) {
        this.openMfaTwoFactorAuthenticationBottomSheet();
      }
    }
  }

  async openDialogTwoFactor() {
    this.openMfaActivationCompletedDialog();

    // enviar pin por email
    // this.store$.dispatch(new MfaStoreActions.SendPinEmailAction());

    // const bottomSheetRef = this.bottomSheet.open(
    //   MfaTwoFactorAuthenticationBottomSheetComponent,
    //   {
    //     panelClass: 'bottom-sheet-prepayment-panel',
    //     hasBackdrop: true,
    //     disableClose: true,
    //     data: {
    //       step: 1,
    //       emailSelected: this.userEmail,
    //       isMfa: true,
    //       isActivation: true,
    //     },
    //   },
    // );

    // bottomSheetRef
    //   .afterDismissed()
    //   .pipe(take(1))
    //   .subscribe(async (data) => {
    //     if (data === true) {

    //     } else if (data === false) {
    //       // await this.openMfaCancelDialog(() => this.openDialogTwoFactor());
    //     }
    //   });
  }

  async openMfaActivationCompletedDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      MfaActivationCompletedBottomSheetComponent,
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
        if (data) {
          await this.openDialogTwoFactor();
        }
      });
  }

  confirmCancelScheduledFinalized() {
    const dialogTwoFactorRef = this.bottomSheet.open(
      ConfirmationBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          title:
            'Você tem certeza que deseja cancelar a sua antecipação programada?',
          description:
            'Você poderá configurar uma nova antecipação programada a qualquer momento.',
          okText: 'Sim, desejo cancelar',
          cancelText: 'Fechar',
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

  async openMfaTwoFactorAuthenticationBottomSheet() {
    this.selectCancelScheduledPrepayment();

    // this.store$.dispatch(
    //   new MfaStoreActions.SendPinSmsAction({
    //     phoneNumber: this.economicGroupPhoneNumber,
    //   }),
    // );

    // const dialogTwoFactorRef = this.bottomSheet.open(
    //   MfaTwoFactorAuthenticationBottomSheetComponent,
    //   {
    //     panelClass: 'bottom-sheet-prepayment-panel',
    //     hasBackdrop: true,
    //     disableClose: true,
    //     data: {
    //       step: 3,
    //       isMfa: false,
    //     },
    //   },
    // );

    // dialogTwoFactorRef
    //   .afterDismissed()
    //   .pipe(take(1))
    //   .subscribe(async (data) => {
    //     if (data === true) {
    //       this.selectCancelScheduledPrepayment();
    //     } else if (data === false) {
    //       // await this.openMfaCancelDialog(() =>
    //       //   this.openMfaTwoFactorAuthenticationBottomSheet(),
    //       // );
    //     }
    //   });
  }

  async openMfaCancelDialog(callback: () => Promise<void>) {
    if (!(await this.confirmCancelMfa())) {
      await callback();
    }
  }

  async onOpenHistoricClick() {
    const bottomSheetRef = this.bottomSheet.open(
      PrepaymentsHistoryBottomSheetComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          establishments: this.selectedEstablishments,
          enableSelectedAllEstablishments: false,
          selectedEstablishments: [
            ...this.selectedEstablishmentsUids.filter(
              (p) => this.prepaymentEstablishmentsSelected === p,
            ),
          ],
        },
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((confirm) => {});
  }

  openDialogUnauthorizedMfa() {
    const bottomSheetRef = this.bottomSheet.open(
      MfaUnauthorizedDialogComponent,
      {
        panelClass: 'bottom-sheet-prepayment-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          this.openDialogTwoFactor();
        }
      });
  }

  async goToSummary() {
    await this.router.navigate(['/summary-mobile'], {});
  }

  openAuthorizationDialog() {
    this.bottomSheet.open(PrepaymentConsentDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {
        establishmentSelected: this.selectedEstablishments.find(
          (x) => x.documentNumber === this.prepaymentEstablishmentsSelected,
        ),
        hasAuthorization: this.hasAuthorizationPermission,
        phoneNumber: this.economicGroupPhoneNumber,
      },
    });
  }

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;
    const scrollTreshold = scrollHeight - scrollTop;

    if (scrollPosition > scrollTreshold) {
      this.textChange2 = 'white';
    } else {
      this.textChange1 = 'var(--bs-secondary)';
      this.textChange2 = 'var(--bs-primary)';
    }
  }
}
