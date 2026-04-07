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
  ReceivablesSchedule,
  ReceivablesScheduleGroupingResponse,
  SelectionModelDay,
} from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { SelectOption } from '@/shared/models/select-options';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs';
import { CheckMarkedComponent } from '../../../components/check-marked/check-marked.component';
import { DialogCancelComponent } from '../../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { BasePage } from '../../base.page';
import { CardPrepaymentsAccreditationsComponent } from '../card-prepayments-accreditations/card-prepayments-accreditations.component';
import { DialogAuthorizationPrepaymentComponent } from '../dialog-authorization-prepayment/dialog-authorization-prepayment.component';
import { DialogScheduledCancelComponent } from '../dialog-scheduled-cancel/dialog-scheduled-cancel.component';
import { DialogScheduledSuccessComponent } from '../dialog-scheduled-success/dialog-scheduled-success.component';

@Component({
  selector: 'app-scheduled-prepayment-page',
  templateUrl: './scheduled-prepayment-page.component.html',
  styleUrls: ['./scheduled-prepayment-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CardPrepaymentsAccreditationsComponent,
    CheckMarkedComponent,
  ],
})
export class ScheduledPrepaymentPageComponent
  extends BasePage
  implements OnInit
{
  economicGroupPhoneNumber = '';
  finalCheck: FinalCheck = {} as FinalCheck;
  viewMode: PrepaymentsViewMode = 'initial';
  viewModeControl = new UntypedFormControl(this.viewMode);
  bankingAccount: BankingAccount = {} as BankingAccount;
  selection = new SelectionModel<SelectionModelDay>(true, []);
  selectionDaysMonth = new SelectionModel<number>(true, []);
  selectionDaysWeek: SelectionModelDay[] = [];
  selectedDaysMonth: number[] = [];
  filteredReceivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  scheduledFinalized: GetScheduledFinalizedResponse = {
    id: null as any,
  } as GetScheduledFinalizedResponse;
  firstWeek = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  secondWeek = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  visibilityOn: boolean = true;
  isEdit = false;
  selectedDatesS: string[] = [];
  rate = 0;
  minLimit = 0;
  maxLimit = 0;
  bankingAccounts: BankingAccount[] = [];
  prepaymentEstablishmentsSelected: string = null as any;
  editCanceled = false;
  canceledScheduled = false;
  accreditations: GetAccreditationsItemResponse[] = [];
  selectedAccreditations = [];
  establishmentSelected!: SelectOption;
  selectedAccreditationsHasError = false;
  selectedDaysHasError = false;
  selectedWeeksHasError = false;

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

  daysOfWeek = [
    {
      day: 1,
      descriptionDay: 'Segunda',
      description: 'Segunda-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 2,
      descriptionDay: 'Terça',
      description: 'Terça-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 3,
      descriptionDay: 'Quarta',
      description: 'Quarta-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 4,
      descriptionDay: 'Quinta',
      description: 'Quinta-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 5,
      descriptionDay: 'Sexta',
      description: 'Sexta-feira',
      selected: false,
    } as SelectionModelDay,
  ];

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  step = 1;
  daysOfWeekError: number[] = [];
  daysOfMonthError: number[] = [];

  get getScheduledMode() {
    let scheduleModeReturn = 'Diariamente';

    if (!!this.viewMode) {
      scheduleModeReturn =
        this.viewMode === 'monthly-accreditations' ||
        this.viewMode === 'monthly-check'
          ? 'Mensalmente'
          : this.viewMode === 'weekly-accreditations' ||
              this.viewMode === 'weekly-check'
            ? 'Semanalmente'
            : 'Diariamente';
    }

    return scheduleModeReturn;
  }

  get totalAvailableAmountPrepayment() {
    if (!isEmpty(this.filteredReceivablesSchedule)) {
      console.log('Array:', this.filteredReceivablesSchedule);
      console.log('Tipo:', typeof this.filteredReceivablesSchedule);
      console.log('É Array?', Array.isArray(this.filteredReceivablesSchedule));

      var selectedDoc = this.selectedEstablishments.filter(
        (x) => x.uid == this.prepaymentEstablishmentsSelected,
      );
      const resultado = this.filteredReceivablesSchedule.some(
        (b: any) => b.documentNumber === selectedDoc[0].documentNumber,
      );
      console.log('Resultado:', resultado);

      return (
        this.filteredReceivablesSchedule
          .filter(
            (p) =>
              p.documentNumber ===
              this.selectedEstablishments.firstOrDefault(
                (x: any) => x.documentNumber === p.documentNumber,
              ),
          )
          ?.sumBy((p) => p.availableValue ?? 0) ?? 0
      );
    }

    return 0;
  }

  get getBankingAccount() {
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

  get isMonthlyAccreditations() {
    return (
      this.viewMode === 'monthly-accreditations' ||
      this.viewMode === 'monthly-check'
    );
  }

  get isWeeklyAccreditations() {
    return (
      this.viewMode === 'weekly-accreditations' ||
      this.viewMode === 'weekly-check'
    );
  }

  @ViewChild('popWeekly', { static: false }) popWeekly: any;
  @ViewChild('popDays', { static: false }) popDays: any;
  @ViewChild('popDay', { static: false }) popDay: any;
  @ViewChild('popMonthly', { static: false }) popMonthly: any;

  daysOfWeekForm!: FormGroup;

  get formDaysOfWeek(): FormArray {
    return this.daysOfWeekForm.get('dayOfWeekSelection') as FormArray;
  }

  constructor(
    private _formBuilder: FormBuilder,
    store$: Store<AppState>,
    private route: ActivatedRoute,
    navigationService: NavigationService,
    public dialog: MatDialog,
    protected router: Router,
  ) {
    super(store$, navigationService);

    const { uid } = this.route.snapshot.queryParams;
    this.prepaymentEstablishmentsSelected = uid;

    this.daysOfWeekForm = new FormGroup({
      dayOfWeekSelection: this.createDaysOfWeek(this.daysOfWeek),
    });
  }

  // Create form array
  createDaysOfWeek(
    daysOfWeek: {
      day: number;
      descriptionDay: string;
      description: string;
      selected: boolean;
    }[],
  ): FormArray {
    const arr = daysOfWeek.map((exercise) => {
      return new FormControl(exercise.selected);
    });
    return new FormArray(arr);
  }

  ngAfterContentInit(): void {
    this.subscribeEconomicGroupPhone();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
    this.subscribeBankingAccounts();
    this.subscribeReceivablesSchedule();
    this.subscribeScheduledRate();
    this.subscribeAccreditations();
    this.subscribeFinalizedScheduledPrepayment();
    this.subscribeScheduledFinalizedPrepayment();
    this.subscribeCanceledScheduledPrepayment();
    this.subscribeEstablishmentsToSelect();
  }

  ngOnInit() {
    this.selectGetEconomicGroupPhone();
    this.selectSaveLead(false, false, true);
    this.selectGetBankingAccount();
    this.selectGetScheduledRate();
    this.selectGetAccreditation();
    this.selectGetScheduledFinalized();
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

  private subscribeScheduledFinalizedPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledFinalizedPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((scheduledFinalized) => {
        this.scheduledFinalized = scheduledFinalized;

        if (!!this.scheduledFinalized && !!this.scheduledFinalized.id) {
          this.isEdit = true;

          if (!isEmpty(this.scheduledFinalized.daysOfWeek)) {
            this.viewMode = 'weekly-accreditations';
            this.viewModeControl.setValue(this.viewMode);

            this.daysOfWeek.map(
              (x) =>
                (x.selected = this.scheduledFinalized.daysOfWeek.some(
                  (p) => p === x.day,
                )),
            );
            this.selection = new SelectionModel<SelectionModelDay>(true, [
              ...this.daysOfWeek.filter((x) => x.selected),
            ]);
          } else if (!isEmpty(this.scheduledFinalized.daysOfMonth)) {
            this.viewMode = 'monthly-accreditations';
            this.viewModeControl.setValue(this.viewMode);

            this.selectionDaysMonth = new SelectionModel<number>(true, [
              ...this.scheduledFinalized.daysOfMonth,
            ]);
          }
        }
      });
  }

  private subscribeAccreditations() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledAccreditations)
      .pipe(takeUntil(this.$unsub))
      .subscribe((accreditations) => {
        this.accreditations = accreditations || [];
      });
  }

  private subscribeReceivablesSchedule() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectReceivablesScheduleGrouping)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesScheduleGrouping) => {
        const receivablesSchedule = receivablesScheduleGrouping || [];

        const schedules: ReceivablesSchedule[] = [];
        receivablesSchedule.map((x) =>
          x.schedules.map((p) => schedules.push(p)),
        );

        if (!isEmpty(receivablesSchedule)) {
          this.filteredReceivablesSchedule = [...receivablesSchedule];
        }
      });
  }

  private subscribeScheduledRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectScheduledRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        this.rate = prepaymentRate?.rate ?? 0;
        this.minLimit = prepaymentRate?.minLimit ?? 0;
        this.maxLimit = prepaymentRate?.maxLimit ?? 0;
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

  private subscribeGetEconomicGroupPhoneHasError() {
    this.store$
      .select(AdministrationStoreSelectors.selectGetEconomicGroupPhoneHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(
            new AdministrationStoreActions.SetNoErrorGetEconomicGroupPhoneAction(),
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
        }
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
            this.onOpenScheduledCancelDialog();
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
          const establishmentsToSelect = [
            ...establishments.map(
              (establishment) =>
                new SelectOption(
                  `${establishment.companyName} - ${establishment.documentNumber}`,
                  establishment.uid,
                ),
            ),
          ];

          const establish = establishmentsToSelect.filter(
            (p) => p.value === this.prepaymentEstablishmentsSelected,
          );

          if (!!establish) {
            this.establishmentSelected = establish[0];
          }
        }
      });
  }

  private selectSaveLead(
    canceled: boolean,
    finished: boolean,
    itStarted: boolean,
  ) {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.SaveLeadAction({
          canceled,
          uid: this.prepaymentEstablishmentsSelected,
          finished,
          itStarted,
          leadAction: LeadAction.scheduledPrepayment,
        }),
      );
    }
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupPhoneAction(),
    );
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

  private selectGetBankingAccount() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetBankingAccountPrepaymentAction({
          uid: this.selectedEstablishmentsUids.firstOrDefault((x) => !!!x),
        }),
      );
    }
  }

  private selectGetAccreditation() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.GetScheduledAccreditationsAction({
        uid: this.prepaymentEstablishmentsSelected,
      }),
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

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }

  onOpenContinue(schedule: any) {
    this.loadFinalCheck();

    if (schedule.isDaily) {
      this.viewMode = 'daily-accreditations';
      this.viewModeControl.setValue(this.viewMode);
      this.step = 2;
    } else if (schedule.isWeekly) {
      this.viewMode = 'weekly-accreditations';
      this.viewModeControl.setValue(this.viewMode);
      this.step = 2;
    } else if (schedule.isMonthly) {
      this.viewMode = 'monthly-accreditations';
      this.viewModeControl.setValue(this.viewMode);
      this.step = 2;
    }
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
      if (!isEmpty(this.selectionDaysMonth)) {
        if (this.selectionDaysMonth.selected.length === 1) {
          selection = this.selectionDaysMonth.selected[0];
        } else {
          const listOrdered = this.selectionDaysMonth.selected.sortBy((x) => x);
          selection = `${listOrdered[0]} e ${listOrdered[1]}`;
        }
      }
    }

    const frequency = this.isMonthlyAccreditations
      ? 'dayOfMonth'
      : this.isWeeklyAccreditations
        ? 'weekday'
        : 'daily';

    this.bankingAccount = this.getBankingAccount;

    this.finalCheck = {
      selectionDescription: selection,
      viewMode: this.viewMode,
      isActivate: true,
      isCancel: false,
      isEdit: this.isEdit,
      isContinue: false,
      daysOfWeek: this.selection?.selected.map((x) => x.day),
      daysOfMonth: this.selectionDaysMonth?.selected.map((x) => x),
      frequency,
      bankingAccount: this.bankingAccount,
    } as FinalCheck;
  }

  onBackClick(viewMode: any) {
    this.selectedAccreditations = [];

    switch (viewMode) {
      case 'weekly-accreditations': {
        this.viewMode = 'initial';
        this.step = 1;
        break;
      }
      case 'monthly-accreditations': {
        this.viewMode = 'initial';
        this.step = 1;
        break;
      }
      case 'weekly-check': {
        this.viewMode = 'weekly-accreditations';
        this.step = 2;
        break;
      }
      case 'monthly-check': {
        this.viewMode = 'monthly-accreditations';
        this.step = 2;
        break;
      }
      case 'monthly-check': {
        this.viewMode = 'monthly-accreditations';
        this.step = 2;
        break;
      }
      default: {
        this.viewMode = 'initial';
        this.step = 1;
      }
    }

    this.viewModeControl.setValue(this.viewMode);
  }

  async onConfirmClick() {
    this.openMfaTwoFactorAuthenticationDialog();
  }

  verifyRequiredSelection() {
    switch (this.viewMode) {
      case 'daily-accreditations': {
        this.selectedAccreditationsHasError = isEmpty(
          this.selectedAccreditations,
        );

        if (this.selectedAccreditationsHasError) {
          this.popDay.hide();
          this.popDay.show();
        } else {
          this.popDay.hide();
        }

        return this.selectedAccreditationsHasError;
      }
      case 'weekly': {
        this.selectedWeeksHasError = !(
          (this.selection?.hasValue() &&
            this.selection?.selected?.length <= 2) ??
          true
        );

        if (this.selectedWeeksHasError) {
          this.popWeekly.hide();
          this.popWeekly.show();
        } else {
          this.popWeekly.hide();
        }

        return this.selectedWeeksHasError;
      }
      case 'weekly-accreditations': {
        this.selectedAccreditationsHasError = isEmpty(
          this.selectedAccreditations,
        );

        this.selectedWeeksHasError = !(
          (this.selection?.hasValue() &&
            this.selection?.selected?.length <= 2) ??
          true
        );

        const hasError =
          this.selectedAccreditationsHasError || this.selectedWeeksHasError;

        if (hasError) {
          this.popWeekly.hide();
          this.popWeekly.show();
        } else {
          this.popWeekly.hide();
        }

        return hasError;
      }
      case 'monthly': {
        this.selectedDaysHasError = !(
          this.selectionDaysMonth?.hasValue() ?? true
        );

        if (this.selectedDaysHasError) {
          this.popMonthly.hide();
          this.popMonthly.show();
        } else {
          this.popMonthly.hide();
        }

        return this.selectedDaysHasError;
      }
      case 'monthly-accreditations': {
        this.selectedDaysHasError = !(
          (this.selectionDaysMonth?.hasValue() &&
            this.selectionDaysMonth?.selected?.length <= 2) ??
          true
        );

        this.selectedAccreditationsHasError = !isEmpty(
          this.selectedAccreditations,
        );

        const hasError =
          this.selectedAccreditationsHasError || this.selectedDaysHasError;

        if (hasError) {
          this.popMonthly.hide();
          this.popMonthly.show();
        } else {
          this.popMonthly.hide();
        }

        return hasError;
      }
    }

    return false;
  }

  onContinueClick(viewMode: any) {
    if (this.verifyRequiredSelection()) {
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
      case 'monthly': {
        this.viewMode = 'monthly-accreditations';
        break;
      }
      case 'weekly-accreditations': {
        this.viewMode = 'weekly-check';
        this.loadFinalCheck();
        this.finalCheck.isContinue = true;

        this.step = 3;
        break;
      }
      case 'daily-accreditations': {
        this.viewMode = 'daily-check';
        this.loadFinalCheck();
        this.finalCheck.isContinue = true;

        this.step = 3;
        break;
      }
      case 'monthly-accreditations': {
        this.viewMode = 'monthly-check';
        this.loadFinalCheck();
        this.finalCheck.isContinue = true;

        this.step = 3;
        break;
      }
    }

    this.viewModeControl.setValue(this.viewMode);
  }

  onCancelClick(): void {
    this.loadFinalCheck();
    this.finalCheck.isCancel = true;
  }

  openMfaTwoFactorAuthenticationDialog() {
    if (this.isEdit || this.editCanceled) {
      this.selectCancelScheduledPrepayment();
    } else {
      this.selectFinalizeScheduledPrepayment();
    }

    // this.store$.dispatch(
    //   new MfaStoreActions.SendPinSmsAction({
    //     phoneNumber: this.economicGroupPhoneNumber,
    //   }),
    // );

    // this.dialog
    //   .open(DialogTwoFactorAuthenticationComponent, {
    //     width: '392px',
    //     hasBackdrop: true,
    //     disableClose: true,
    //     data: {
    //       step: 3,
    //       isMfa: false,
    //       isVerify: true,
    //       isScheduled: true,
    //       phoneNumber: this.economicGroupPhoneNumber,
    //     },
    //   })
    //   .afterClosed()
    //   .subscribe((data) => {
    //     if (data === true) {
    //       if (this.isEdit || this.editCanceled) {
    //         this.selectCancelScheduledPrepayment();
    //       } else {
    //         this.selectFinalizeScheduledPrepayment();
    //       }
    //     } else if (data === false) {
    //       if (this.editCanceled) {
    //         this.selectCancelScheduledPrepayment();
    //       } else {
    //         this.openMfaCancelDialog();
    //       }
    //     }
    //   });
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
    const frequency = this.isMonthlyAccreditations
      ? 'dayOfMonth'
      : this.isWeeklyAccreditations
        ? 'weekday'
        : 'daily';

    const daysOfWeek: number[] = this.selection.selected.map((x) => x.day);
    const daysOfMonth: number[] = this.selectionDaysMonth.selected.map(
      (x) => x,
    );

    const request = {
      uid: this.prepaymentEstablishmentsSelected,
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
        this.selectSaveLead(false, true, false);
        this.goToPrepayments();
      }
    });
  }

  async goToPrepayments() {
    await this.router.navigate(['/prepayments'], {
      queryParams: {
        uid: this.prepaymentEstablishmentsSelected,
      },
    });
  }

  async onSelectedAccreditations(event: any) {
    this.selectedAccreditations = [];
    this.selectedAccreditations = event;
  }

  async openAuthorizationDialog() {
    const config: MatDialogConfig = {
      width: '40%',
      hasBackdrop: true,
      disableClose: false,
      data: {
        establishmentSelected: this.establishmentSelected,
      },
    };

    const dialogCancelRef = this.dialog.open(
      DialogAuthorizationPrepaymentComponent,
      config,
    );
  }

  async clickChecked(
    event: any,
    dayOfWeek: SelectionModelDay,
    selectionDaysWeek: any,
  ) {
    if (event) {
      this.selection.toggle(dayOfWeek);
    }

    if (dayOfWeek.selected && !selectionDaysWeek.includes(dayOfWeek)) {
      selectionDaysWeek.push(dayOfWeek);
    } else {
      if (selectionDaysWeek.includes(dayOfWeek)) {
        const idx = selectionDaysWeek.indexOf(dayOfWeek);

        if (idx !== -1) {
          selectionDaysWeek.splice(idx, 1);
        }
      }
    }

    if (selectionDaysWeek.length > 2) {
      this.popDays.show();
      this.daysOfWeekError.push(dayOfWeek.day);
      this.selectedWeeksHasError = true;
    } else {
      this.popDays.hide();
      this.daysOfWeekError = [];
      this.selectedWeeksHasError = false;
    }

    console.log(`day ${dayOfWeek.day} - checked: ${dayOfWeek.selected}`);
    console.log(`day ${dayOfWeek.day} - checked: ${dayOfWeek.selected}`);
  }

  async clickDayMonthChecked(event: any, selectedDaysMonth: any, day: any) {
    if (event) {
      this.selectionDaysMonth.toggle(day);
    }

    if (!selectedDaysMonth.includes(day)) {
      selectedDaysMonth.push(day);
    } else {
      if (selectedDaysMonth.includes(day)) {
        const idx = selectedDaysMonth.indexOf(day);

        if (idx !== -1) {
          selectedDaysMonth.splice(idx, 1);
        }
      }
    }

    if (selectedDaysMonth.length > 2) {
      this.popDays.show();
      this.daysOfMonthError.push(day);
      this.selectedDaysHasError = true;
    } else {
      this.popDays.hide();
      this.daysOfMonthError = [];
      this.selectedDaysHasError = false;
    }
  }
}
