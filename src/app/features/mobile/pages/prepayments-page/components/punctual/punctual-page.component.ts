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
  FinalizePunctualRequest,
  getAccreditationName,
  LeadAction,
  PunctualDetail,
  ReceivablesSchedule,
  ReceivablesScheduleGroupingResponse,
} from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { firstValueFrom, map, take, takeUntil } from 'rxjs';
import { ConfirmationBottomSheetComponent } from 'src/app/features/mobile/components/confirmation-bottom-sheet/confirmation-bottom-sheet.component';
import { ExpansionPanelItemComponent } from '../../../../../../shared/components/expansion-panel/expansion-panel-item.component';
import { ExpansionPanelComponent } from '../../../../../../shared/components/expansion-panel/expansion-panel.component';
import { StepperComponent } from '../../../../../../shared/components/stepper/stepper.component';
import { MobileBasePage } from '../../../mobile-base.page';
import { IScheduleValidationError } from '../scheduled/models/schedule-validation';
import { MfaTwoFactorAuthenticationBottomSheetComponent } from './../../../../components/mfa/mfa-two-factor-authentication-bottom-sheet/mfa-two-factor-authentication-bottom-sheet.component';
import { ToolbarBackgroundComponent } from './../../../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from './../../../../services/sidenav.service';
import { ToolbarService } from './../../../../services/toolbar.service';
import { PunctualCancelDialogComponent } from './components/punctual-cancel-dialog/punctual-cancel-dialog.component';
import { PunctualSuccessDialogComponent } from './components/punctual-success-dialog/punctual-success-dialog.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent,
    ToolbarBackgroundComponent,
    ExpansionPanelComponent,
    ExpansionPanelItemComponent,
  ],
  templateUrl: './punctual-page.component.html',
  styleUrls: ['./punctual-page.component.scss'],
})
export class PrepaymentsPunctualPageComponent extends MobileBasePage {
  receivablesSchedule: ReceivablesScheduleGroupingResponse[] = [];
  schedules: ReceivablesSchedule[] = [];
  documetNumberSelected = '';
  bankingAccount?: BankingAccount;
  rate = 0;
  totalAmount = 0;
  selection = new SelectionModel<ReceivablesSchedule>(true, []);
  punctualDetail: PunctualDetail = {} as PunctualDetail;
  economicGroupPhoneNumber = '';
  isAllSelected: boolean = false;
  currentStep: 'initial' | 'resume' = 'initial';

  errors: IScheduleValidationError[] = [];

  get totalAmountPrepayment() {
    return !isEmpty(this.selection.selected)
      ? this.selection.selected.sumBy((p) => p.prepaymentValue ?? 0)
      : 0;
  }

  get totalAmountPrepaymentRate() {
    return !isEmpty(this.selection.selected)
      ? this.selection.selected.map((s) => s.prepaymentValue * s.rate).sum()
      : 0;
  }

  get totalAmountSchedules() {
    return !isEmpty(this.schedules)
      ? this.schedules.sumBy((p) => p.prepaymentValue ?? 0)
      : 0;
  }

  get selectedAccreditationsName() {
    return this.selection.selected
      .map((p) => p.documentNumberAccreditor)
      .uniq()
      .map((p) => getAccreditationName(p))
      .join(', ');
  }

  get hasReceivablesSchedule() {
    return !isEmpty(this.schedules) && this.schedules.length > 0;
  }

  @ViewChild('punctualDetailRef') private punctualDetailRef!: TemplateRef<any>;

  isHidden = false;

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

    const { uid } = this.route.snapshot.queryParams;
    this.documetNumberSelected = uid;
  }

  ngOnInit() {
    this.selectSaveLead(false, false, true);
    this.selectGetEconomicGroupPhone();
    this.subscribeReceivablesSchedule();
    this.subscribeEconomicGroupPhone();
    this.subscribeFinalizedPunctualPrepayment();
    this.subscribePunctualPrepaymentHasError();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribePunctualRate();
    this.subscribeVerificationCompletedHasError();
  }

  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;

    // Defina a condição de rolagem aqui
    this.isHidden = scrollTop > 70; // Por exemplo, esconde quando o scroll passa de 50px
  }

  checkError() {
    this.errors = [];

    if (!this.selection.selected.length) {
      this.errors.push({
        title: 'Selecione as transações abaixo que deseja antecipar.',
      });
    }
  }

  onContinueStep1() {
    this.checkError();

    if (!!this.errors.length) {
      return;
    }

    this.currentStep = 'resume';
  }

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private subscribeFinalizedPunctualPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectFinalizedPunctualPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((finalized) => {
        if (finalized) {
          this.selectSaveLead(false, true, false);
          this.openPunctualSuccessDialog();
        }
      });
  }

  private subscribeReceivablesSchedule() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectReceivablesScheduleGrouping)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesSchedule) => {
        this.receivablesSchedule = receivablesSchedule || [];

        if (!isEmpty(this.receivablesSchedule)) {
          this.bankingAccount = this.receivablesSchedule
            .map((p) => p.bankingAccount)
            .firstOrDefault((x: any) => !!x);
          this.receivablesSchedule.map((p) =>
            p.schedules.map((x) => this.schedules.push(x)),
          );
        }
      });
  }

  private subscribePunctualPrepaymentHasError() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectPunctualPrepaymentHasError)
      .pipe(takeUntil(this.$unsub))
      .subscribe((error) => {
        if (!!error) {
          this.store$.dispatch(
            new PrepaymentsStoreActions.SetNoErrorPunctualPrepaymentAction(),
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

  private subscribePunctualRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectPunctualRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        this.rate = prepaymentRate?.rate ?? 0;
      });
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
          leadAction: LeadAction.punctualPrepayment,
        }),
      );
    }
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(
      new AdministrationStoreActions.GetEconomicGroupPhoneAction(),
    );
  }

  private selectFinalizedPunctualPrepayment() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.FinalizedPunctualPrepaymentAction(),
    );
  }

  onToggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;

    if (this.isAllSelected) {
      this.schedules.forEach((schedule) => {
        this.selection.select(schedule);
      });
    } else {
      this.schedules.forEach((schedule) => {
        this.selection.deselect(schedule);
      });
    }

    this.checkError();
  }

  onSelectSchedule(schedule: ReceivablesSchedule, event: MouseEvent) {
    event.stopPropagation();
    this.selection.toggle(schedule);

    this.isAllSelected =
      !!this.schedules.length &&
      this.schedules.length === this.selection.selected.length;
    this.checkError();
  }

  async openMfaTwoFactorAuthenticationBottomSheet() {
    const schedules: FinalizePunctualRequest[] = [];

    this.selection.selected.map((x) =>
      schedules.push({
        arScheduleId: x.arScheduleId,
        uid: this.selectedEstablishments.filter(
          (x) => x.documentNumber == x.documentNumber,
        )[0].uid,
      } as FinalizePunctualRequest),
    );

    this.store$.dispatch(
      new PrepaymentsStoreActions.FinalizePunctualPrepaymentAction({
        uid: this.documetNumberSelected,
        schedules,
      }),
    );

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

  async onOpenPunctualDetailsDialog() {
    this.totalAmount = this.selection.selected.sumBy((p) => p.totalFreeValue);

    this.store$.dispatch(
      new PrepaymentsStoreActions.GetPunctualRatePrepaymentAction({
        uid: this.documetNumberSelected,
        prepaymentTotalAmount: this.totalAmount,
      }),
    );
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

  async openPunctualSuccessDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      PunctualSuccessDialogComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {
          documentNumberSelected: this.documetNumberSelected,
        },
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((concluido) => {
        this.selectFinalizedPunctualPrepayment();

        if (concluido === true) {
          this.onNavigateBack();
        } else if (concluido === false) {
        } else {
          this.goToPrepayments();
        }
      });
  }

  async onOpenPunctualDetail(schedule: ReceivablesSchedule) {
    this.punctualDetail = {
      bankingAccount: this.bankingAccount,
      rate: schedule.rate,
      prepaymentTotalAmount: schedule.prepaymentValue,
      schedule,
      totalAmount: schedule.totalFreeValue,
      visibilityOn: this.visibilityOn,
    } as PunctualDetail;

    await this.sidenavService.open(this.punctualDetailRef);
  }

  async onClosePunctualDetail() {
    await this.sidenavService.close();
  }

  async onOpenPunctualCancelDialog() {
    const bottomSheetRef = this.bottomSheet.open(
      PunctualCancelDialogComponent,
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
      .subscribe((confirm) => {
        if (!confirm) {
          this.selectSaveLead(true, false, false);
          this.onNavigateBack();
        }
      });
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.schedules);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReceivablesSchedule): string {
    if (!row) {
      return `${this.isAllSelected ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }
}
