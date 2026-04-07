import {
  AdministrationStoreActions,
  AdministrationStoreSelectors,
} from '@/root-store/administration-store';
import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import {
  PrepaymentsStoreActions,
  PrepaymentsStoreSelectors,
} from '@/root-store/prepayments-store';
import {
  BankingAccount,
  FinalCheck,
  FinalizeScheduledRequest,
  getAccreditationName,
  GetAccreditationsItemResponse,
  GetScheduledFinalizedResponse,
  LeadAction,
  PrepaymentsViewMode,
  ReceivablesScheduleGroupingResponse,
  SelectionModelDay,
} from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Moment } from 'moment';
import { firstValueFrom, map, take, takeUntil } from 'rxjs';
import { StepperComponent } from '../../../../../../shared/components/stepper/stepper.component';
import { MobileBasePage } from '../../../mobile-base.page';
import { PrepaymentsAccreditationsCardComponent } from '../accreditations/prepayments-accreditations-card/prepayments-accreditations-card.component';
import { CheckMarkedComponent } from './../../../../../main/components/check-marked/check-marked.component';
import { ConfirmationBottomSheetComponent } from './../../../../components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from './../../../../components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { ToolbarBackgroundComponent } from './../../../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from './../../../../services/sidenav.service';
import { ToolbarService } from './../../../../services/toolbar.service';
import { MonthlyActivationComponent } from './components/monthly-activation/monthly-activation.component';
import { ScheduledCancelDialogComponent } from './components/scheduled-cancel-dialog/scheduled-cancel-dialog.component';
import { ScheduledSuccessBottomSheetComponent } from './components/scheduled-success-bottom-sheet/scheduled-success-bottom-sheet.component';
import { WeeklyActivationComponent } from './components/weekly-activation/weekly-activation.component';
import { IScheduleValidationError } from './models/schedule-validation';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    PrepaymentsAccreditationsCardComponent,
    CheckMarkedComponent,
    StepperComponent,
    ToolbarBackgroundComponent,
    WeeklyActivationComponent,
    MonthlyActivationComponent,
  ],
  templateUrl: './scheduled-page.component.html',
  styleUrls: ['./scheduled-page.component.scss'],
})
export class PrepaymentsScheduledPageComponent extends MobileBasePage {
  finalCheck: FinalCheck = {} as FinalCheck;
  viewMode: PrepaymentsViewMode = 'initial';
  viewModeControl = new UntypedFormControl(this.viewMode);
  receivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  bankingAccount: BankingAccount | null = null;
  rate = 0;
  maxLimit = 0;
  minLimit = 0;
  scheduledFinalized: GetScheduledFinalizedResponse = {
    id: null as any,
  } as GetScheduledFinalizedResponse;
  selection = new SelectionModel<SelectionModelDay>(true, []);
  daysOfMonthSelection = new SelectionModel<number>(true, []);
  documetNumberSelected = '';
  isEdit = false;
  economicGroupPhoneNumber = '';
  canceledScheduled = false;
  selectedAccreditations: any[] = [];
  accreditations: GetAccreditationsItemResponse[] = [];

  errors: IScheduleValidationError[] = [];

  schedules = [
    {
      title: 'Diariamente',
      description: 'Receba suas vendas no dia útil seguinte',
      benefits: [
        'Fluxo de caixa sempre disponível',
        'Receba sempre no dia seguinte',
        'Contratação simples e fácil',
      ],
      isDaily: true,
      isWeekly: false,
      isMonthly: false,
    },
    {
      title: 'Semanalmente',
      description: 'Receba suas vendas toda semana, nos dias escolhidos',
      benefits: [
        'Programe os recebíveis para semana',
        'Utilize para pagamentos estratégicos',
        'Não espere 30 dias para receber vendas de crédito',
      ],
      isDaily: false,
      isWeekly: true,
      isMonthly: false,
    },
    {
      title: 'Mensalmente',
      description: 'Receba suas vendas em dias específicos no mês',
      benefits: [
        'Pague suas contas mensais com seus recebíveis',
        'Traga previsibilidade para as suas finanças',
        'Tenha mais praticidade e tranquilidade',
      ],
      isDaily: false,
      isWeekly: false,
      isMonthly: true,
    },
  ];

  daysOfWeek: SelectionModelDay[] = [
    {
      day: 1,
      descriptionDay: 'Segunda',
      description: 'Segunda-feira',
      selected: false,
    },
    {
      day: 2,
      descriptionDay: 'Terça',
      description: 'Terça-feira',
      selected: false,
    },
    {
      day: 3,
      descriptionDay: 'Quarta',
      description: 'Quarta-feira',
      selected: false,
    },
    {
      day: 4,
      descriptionDay: 'Quinta',
      description: 'Quinta-feira',
      selected: false,
    },
    {
      day: 5,
      descriptionDay: 'Sexta',
      description: 'Sexta-feira',
      selected: false,
    },
  ];

  get isMonthlyAccreditations() {
    return this.viewMode === 'monthly-accreditations';
  }

  get isWeeklyAccreditations() {
    return this.viewMode === 'weekly-accreditations';
  }

  get selectedAccreditationsName() {
    return this.selectedAccreditations
      .map((a) => getAccreditationName(a))
      .join(', ');
  }

  get selectedWeeklyDaysName() {
    return this.selection.selected
      .sortBy((a) => a.day)
      .map((a) => a.descriptionDay)
      .join(' e ');
  }

  get selectedMonthlyDaysName() {
    return this.daysOfMonthSelection.selected.sort((a, b) => a - b).join(' e ');
  }

  isLastItem(index: number): boolean {
    return index === this.daysOfWeek.length - 1;
  }

  @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    medalliaService: MedalliaService,
    router: Router,
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

    const { uid, isEdit } = this.route.snapshot.queryParams;
    this.documetNumberSelected = uid;
    this.isEdit = isEdit;
  }

  ngOnInit() {
    this.selectGetEconomicGroupPhone();
    this.selectGetAccreditation();
    this.selectSaveLead(false, false, true);
    this.subscribeBankingAccounts();
    this.subscribeEconomicGroupPhone();
    this.subscribeFinalizedScheduledPrepayment();
    this.subscribeScheduledRate();
    this.subscribeScheduledPrepaymentHasError();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
    this.subscribeCanceledScheduledPrepayment();
    this.subscribeScheduledFinalizedPrepayment();
    this.subscribeAccreditations();

    this.store$.dispatch(
      new PrepaymentsStoreActions.GetScheduledRatePrepaymentAction({
        uid: this.documetNumberSelected,
        prepaymentTotalAmount: 0,
      }),
    );
  }

  private selectSaveLead(
    canceled: boolean,
    finished: boolean,
    itStarted: boolean,
  ) {
    if (!!this.documetNumberSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.SaveLeadAction({
          canceled,
          uid: this.documetNumberSelected,
          finished,
          itStarted,
          leadAction: LeadAction.scheduledPrepayment,
        }),
      );
    }
  }

  private selectGetAccreditation() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.GetScheduledAccreditationsAction({
        uid: this.documetNumberSelected,
      }),
    );
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupPhoneAction(),
    );
  }

  private selectCancelScheduledPrepayment() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.CancelScheduledPrepaymentAction({
        id: this.scheduledFinalized.id,
        uid: this.documetNumberSelected,
      }),
    );
  }

  private subscribeAccreditations() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledAccreditations)
      .pipe(takeUntil(this.$unsub))
      .subscribe((accreditations) => {
        this.accreditations = accreditations || [];
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

  private subscribeScheduledRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        this.rate = prepaymentRate?.rate ?? 0;
        this.maxLimit = prepaymentRate?.maxLimit ?? 0;
        this.minLimit = prepaymentRate?.minLimit ?? 0;
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

  private subscribeBankingAccounts() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bankingAccounts) => {
        const bankAccounts = bankingAccounts || [];

        if (!isEmpty(bankAccounts)) {
          var selectedDoc = this.selectedEstablishments.filter(
            (x) => x.uid == this.documetNumberSelected,
          );

          this.bankingAccount = bankAccounts
            .filter(
              (b: BankingAccount) =>
                b.documentNumber === selectedDoc[0].documentNumber,
            )
            .firstOrDefault((x: BankingAccount) => !!x);
        }
      });
  }

  private subscribeFinalizedScheduledPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectFinalizedScheduledPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((finalized) => {
        if (finalized) {
          this.selectSaveLead(false, true, false);
          this.openScheduledSuccessDialog();
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
            this.selectFinalizeScheduledPrepayment();
          } else {
            this.onOpenScheduledCancelDialog();
          }
        }
      });
  }

  private selectFinalizeScheduledPrepayment() {
    const frequency = this.isMonthlyAccreditations
      ? 'dayOfMonth'
      : this.isWeeklyAccreditations
        ? 'weekday'
        : 'daily';

    const daysOfWeek: number[] = this.selection.selected.map((x) => x.day);
    const daysOfMonth: number[] = this.daysOfMonthSelection.selected;

    const request = {
      uid: this.documetNumberSelected,
      rate: this.rate,
      maxLimit: this.maxLimit,
      minLimit: this.minLimit,
      frequency,
      daysOfWeek,
      daysOfMonth,
      accreditations: this.selectedAccreditations,
    } as FinalizeScheduledRequest;

    this.store$.dispatch(
      new PrepaymentsStoreActions.FinalizeScheduledPrepaymentAction({
        request,
      }),
    );
  }

  async openMfaTwoFactorAuthenticationBottomSheet() {
    if (this.isEdit) {
      this.selectCancelScheduledPrepayment();
    } else {
      this.selectFinalizeScheduledPrepayment();
    }

    // this.store$.dispatch(
    //   new MfaStoreActions.SendPinSmsAction({
    //     phoneNumber: this.economicGroupPhoneNumber,
    //   }),
    // );

    // const bottomSheetRef = this.bottomSheet.open(
    //   MfaTwoFactorAuthenticationBottomSheetComponent,
    //   {
    //     panelClass: 'bottom-sheet-prepayment-panel',
    //     hasBackdrop: true,
    //     disableClose: true,
    //     data: {
    //       step: 3,
    //       isMfa: false,
    //       isActivation: true,
    //       isScheduled: true,
    //     },
    //   },
    // );

    // bottomSheetRef
    //   .afterDismissed()
    //   .pipe(take(1))
    //   .subscribe(async (data) => {
    //     if (data === true) {

    //     } else if (data === false) {
    //       // await this.openMfaCancelDialog(() => this.openMfaTwoFactorAuthenticationBottomSheet());
    //     }
    //   });
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

  async openMfaCancelDialog(callback: () => Promise<void>) {
    if (!(await this.confirmCancelMfa())) {
      await callback();
    }
  }

  async openScheduledSuccessDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      ScheduledSuccessBottomSheetComponent,
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
      .subscribe((concluido) => {
        if (concluido) {
          this.store$.dispatch(
            new PrepaymentsStoreActions.FinalizedScheduledPrepaymentAction(),
          );
          this.goToPrepayments();
        }
      });
  }

  private loadFinalCheck() {
    let selection = null as any;

    if (this.isWeeklyAccreditations) {
      if (this.selection.hasValue()) {
        if (this.selection.selected.length === 1) {
          selection = this.selection.selected[0].descriptionDay;
        } else {
          const listOrdered = this.selection.selected.sortBy((x) => x.day);
          selection = `${listOrdered[0].descriptionDay} e ${listOrdered[1].descriptionDay}`;
        }
      }
    } else if (this.isMonthlyAccreditations) {
      if (this.daysOfMonthSelection.hasValue()) {
        if (this.daysOfMonthSelection.selected.length === 1) {
          selection = this.daysOfMonthSelection.selected[0];
        } else {
          const listOrdered = this.daysOfMonthSelection.selected.sort();
          selection = `${listOrdered[0]} e ${listOrdered[1]}`;
        }
      }
    }

    const frequency = this.isMonthlyAccreditations
      ? 'dayOfMonth'
      : this.isWeeklyAccreditations
        ? 'weekday'
        : 'daily';

    this.finalCheck = {
      selectionDescription: selection,
      viewMode: this.viewMode,
      isActivate: true,
      isCancel: false,
      isEdit: this.isEdit,
      isContinue: false,
      daysOfWeek: this.selection?.selected.map((x) => x.day),
      daysOfMonth: this.daysOfMonthSelection.selected,
      frequency,
    } as FinalCheck;
  }

  onOpenContinue(schedule: any) {
    if (schedule.isDaily) {
      this.viewMode = 'daily-accreditations';
      this.viewModeControl.setValue(this.viewMode);
    } else if (schedule.isWeekly) {
      this.viewMode = 'weekly';
      this.viewModeControl.setValue(this.viewMode);
    } else if (schedule.isMonthly) {
      this.viewMode = 'monthly';
      this.viewModeControl.setValue(this.viewMode);
    }

    window.scrollTo(0, 0);
  }

  checkError(viewMode: PrepaymentsViewMode) {
    this.errors = [];

    switch (viewMode) {
      case 'daily-accreditations': {
        if (!(this.selectedAccreditations ?? []).length) {
          this.errors.push({
            title: 'Selecione a credenciadora.',
            description: 'Selecione pelo menos 1 opção para continuar.',
          });
        }

        break;
      }
      case 'weekly': {
        if (!this.selection?.hasValue()) {
          this.errors.push({
            title: 'Selecione até 2 dias para receber.',
            description: 'Selecione pelo menos 1 dia para continuar.',
          });
        }

        if (this.selection.selected.length > 2) {
          this.errors.push({
            title: 'Você pode selecionar apenas 2 opções.',
            description: 'Remova 1 das seleções para selecionar este dia.',
          });
        }

        break;
      }
      case 'weekly-accreditations': {
        if (!(this.selectedAccreditations ?? []).length) {
          this.errors.push({
            title: 'Selecione a credenciadora.',
            description: 'Selecione pelo menos 1 opção para continuar.',
          });
        }

        break;
      }
      case 'monthly': {
        if (!this.daysOfMonthSelection?.hasValue()) {
          this.errors.push({
            title: 'Selecione até 2 dias para receber.',
            description: 'Selecione pelo menos 1 dia para continuar.',
          });
        }

        if (this.daysOfMonthSelection.selected.length > 2) {
          this.errors.push({
            title: 'Você pode selecionar apenas 2 opções.',
            description: 'Remova 1 das seleções para selecionar este dia.',
          });
        }

        break;
      }
      case 'monthly-accreditations': {
        if (!(this.selectedAccreditations ?? []).length) {
          this.errors.push({
            title: 'Selecione a credenciadora.',
            description: 'Selecione pelo menos 1 opção para continuar.',
          });
        }
        break;
      }
    }
  }

  onContinueClick(viewMode: PrepaymentsViewMode) {
    this.checkError(viewMode);

    if (!!this.errors.length) {
      return;
    }

    switch (viewMode) {
      case 'weekly': {
        this.viewMode = 'weekly-accreditations';
        break;
      }
      case 'daily': {
        this.viewMode = 'daily-accreditations';
        break;
      }
      case 'daily-accreditations': {
        this.loadFinalCheck();
        this.viewMode = 'daily-check';
        break;
      }
      case 'weekly-accreditations': {
        this.loadFinalCheck();
        this.viewMode = 'weekly-check';
        break;
      }
      case 'monthly': {
        this.viewMode = 'monthly-accreditations';
        break;
      }
      case 'monthly-accreditations': {
        this.loadFinalCheck();
        this.viewMode = 'monthly-check';
        break;
      }
      default: {
      }
    }

    this.viewModeControl.setValue(this.viewMode);
    window.scrollTo(0, 0);
  }

  async onCloseFinalCheck() {
    await this.sidenavService.close();
  }

  getDateOnly(date: Moment): string {
    return date.toISOString().split('T')[0];
  }

  async onSelectedAccreditations(event: any[]) {
    this.selectedAccreditations = [...event];
    this.checkError(this.viewMode);
  }

  async onSelectDaysOfWeek(event: SelectionModelDay[]) {
    this.selection.clear();
    this.selection.select(...event);
    this.checkError(this.viewMode);
  }

  async onSelectDaysOfMonth(event: number[]) {
    this.daysOfMonthSelection.clear();
    this.daysOfMonthSelection.select(...event);
    this.checkError(this.viewMode);
  }

  onBackClick(viewMode: any) {
    switch (viewMode) {
      case 'daily-check': {
        this.viewMode = 'daily-accreditations';
        break;
      }
      case 'daily-accreditations': {
        this.viewMode = 'initial';
        break;
      }
      case 'weekly-check': {
        this.viewMode = 'weekly-accreditations';
        break;
      }
      case 'weekly-accreditations': {
        this.viewMode = 'weekly';
        break;
      }
      case 'weekly': {
        this.viewMode = 'initial';
        break;
      }
      case 'monthly-check': {
        this.viewMode = 'monthly-accreditations';
        break;
      }
      case 'monthly-accreditations': {
        this.viewMode = 'monthly';
        break;
      }
      case 'monthly': {
        this.viewMode = 'initial';
        break;
      }
      default: {
        this.viewMode = 'initial';
      }
    }

    this.viewModeControl.setValue(this.viewMode);
    window.scrollTo(0, 0);
  }

  async goActivate() {
    await this.router.navigate(['/prepayments/mobile/scheduled'], {
      queryParams: {
        uid: this.documetNumberSelected,
      },
    });
  }

  async goToPrepayments() {
    await this.router.navigate(['/prepayments/mobile'], {
      queryParams: {
        uid: this.documetNumberSelected,
      },
    });
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
          this.selectSaveLead(true, false, false);
          this.setInitialState();
        }
      });
  }

  private setInitialState() {
    if (this.viewMode === 'initial') {
      this.goToPrepayments();
    } else {
      if (this.selection.hasValue()) {
        this.selection = new SelectionModel<SelectionModelDay>(true, []);
      }

      if (this.daysOfMonthSelection.hasValue()) {
        this.daysOfMonthSelection = new SelectionModel<number>(true, []);
      }

      this.viewMode = 'initial';
      this.viewModeControl.setValue(this.viewMode);
    }
  }
}
