import { AdministrationStoreActions, AdministrationStoreSelectors } from '@/root-store/administration-store';
import { MfaStoreActions, MfaStoreSelectors } from '@/root-store/mfa-store';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from '@/root-store/prepayments-store';
import { BankingAccount, FinalizePunctualRequest, getAccreditationName, LeadAction, ReceivablesSchedule } from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { SortableHeaderDirective, SortEvent, TableService } from '@/shared/components/table';
import { SelectOption } from '@/shared/models/select-options';
import { TablePagination } from '@/shared/models/table.model';
import { NavigationService } from '@/shared/services/navigation.service';
import { NotificationService } from '@/shared/services/notification.service';
import { SharedModule } from '@/shared/shared.module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs';
import { DialogCancelComponent } from '../../../components/mfa/dialog-cancel/dialog-cancel.component';
import { DialogTwoFactorAuthenticationComponent } from '../../../components/mfa/dialog-two-factor-authentication/dialog-two-factor-authentication.component';
import { BasePage } from '../../base.page';
import { DialogAuthorizationPrepaymentComponent } from '../dialog-authorization-prepayment/dialog-authorization-prepayment.component';
import { DialogPunctualCancelComponent } from '../dialog-punctual-cancel/dialog-punctual-cancel.component';
import { DialogPunctualFinalCheckComponent } from '../dialog-punctual-final-check/dialog-punctual-final-check.component';
import { DialogPunctualSuccessComponent } from '../dialog-punctual-success/dialog-punctual-success.component';

@Component({
  selector: 'app-punctual-prepayment-page',
  templateUrl: './punctual-prepayment-page.component.html',
  styleUrls: ['./punctual-prepayment-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class PunctualPrepaymentPageComponent extends BasePage implements OnInit, AfterContentInit, OnDestroy {

  economicGroupPhoneNumber = '';
  selection = new SelectionModel<ReceivablesSchedule>(true, []);
  dataSource: ReceivablesSchedule[] = [];
  filteredItems: ReceivablesSchedule[] = [];
  originalReceivablesSchedule: ReceivablesSchedule[] = [];
  bankingAccounts: BankingAccount[] = [];
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;
  page?: number;
  prepaymentEstablishmentsSelected: string = null as any;
  totalAmount = 0;
  sendAnticipate = false;
  rate = 0;
  step = 1;
  establishmentSelected!: SelectOption;
  visibilityOn: boolean = true;
  selectedAccreditations: string[] = null as any;
  bankingAccount!: BankingAccount;

  columnsToDisplay = [
    'select',
    'documentNumberAccreditor',
    'totalFreeValue',
    'prepaymentValue',
    'rate',
    'arScheduleId',
    'documentNumber',
    'expectedDettlementDate',
  ];

  get totalAmountPrepayment() {
    return this.selection.hasValue()
      ? this.selection.selected.sumBy(p => p.prepaymentValue ?? 0)
      : 0
  }

  get totalAmountAvailable() {
    return !!this.filteredItems
      ? this.filteredItems.sumBy(p => p.prepaymentValue ?? 0)
      : 0
  }

  get hasReceivablesSchedule() {
    return !isEmpty(this.originalReceivablesSchedule) && this.originalReceivablesSchedule.length > 0;
  }

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  @ViewChild('pop', { static: false }) pop: any;

  constructor(
    store$: Store<AppState>,
    private route: ActivatedRoute,
    navigationService: NavigationService,
    private notifcationService: NotificationService,
    public dialog: MatDialog,
    protected router: Router,
    private tableService: TableService) {

    super(store$, navigationService);

    const { uid } = this.route.snapshot.queryParams;
    this.prepaymentEstablishmentsSelected = uid;
  }

  ngAfterContentInit(): void {

  }

  ngOnInit() {

    this.selectGetReceivablesSchedule();
    this.selectSaveLead(false, false, true);

    this.subscribeEconomicGroupPhone();
    this.subscribeGetEconomicGroupPhoneHasError();
    this.subscribePinSmsHasError();
    this.subscribeVerificationCompletedHasError();
    this.subscribeBankingAccounts();
    this.subscribeFinalizePunctualPrepayment();
    this.subscribeReceivablesSchedule();
    this.subscribePunctualRate();
    this.subscribeFinalizedPunctualPrepayment();
    this.subscribeEstablishmentsToSelect();
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
                new SelectOption(`${establishment.companyName} - ${establishment.documentNumber}`, establishment.uid)
            ),
          ];

          const establish = establishmentsToSelect.filter((p) => p.value === this.prepaymentEstablishmentsSelected);

          if (!!establish) {
            this.establishmentSelected = establish[0];
          }
        }
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

  private subscribePunctualRate() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectPunctualRatePrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((prepaymentRate) => {
        if (this.sendAnticipate) {
          this.rate = prepaymentRate?.rate ?? 0;
          this.selectedAccreditations =
            Array.from(new Set(this.selection.selected.map((item: any) => item.documentNumberAccreditor)));
        }
      });
  }

  private subscribeBankingAccounts() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bankingAccounts) => {
        this.bankingAccounts = (bankingAccounts || []);
      });
  }

  private subscribeReceivablesSchedule() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectReceivablesScheduleGrouping)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesScheduleGrouping) => {
        const receivablesSchedule = (receivablesScheduleGrouping || []);

        const schedules: ReceivablesSchedule[] = [];
        receivablesSchedule.map(x => x.schedules.map(p => schedules.push(p)));

        this.originalReceivablesSchedule = [...schedules];

        this.filteredItems = [...schedules];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });

        if (!isEmpty(receivablesSchedule)) {
          this.selectGetEconomicGroupPhone();
          this.selectGetBankingAccount();
        }

      });

    this.store$
      .select(PrepaymentsStoreSelectors.selectBankingAccounts)
      .pipe(takeUntil(this.$unsub))
      .subscribe((bankingAccounts) => {
        this.bankingAccounts = (bankingAccounts || []);
      });
  }

  private subscribeFinalizePunctualPrepayment() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectFinalizedPunctualPrepayment)
      .pipe(takeUntil(this.$unsub))
      .subscribe((finalizedPunctualPrepayment) => {

        if (finalizedPunctualPrepayment) {
          // this.openDialogSuccessPunctualPrepayment();
        }
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

  private subscribeEconomicGroupPhone() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupPhone)
      .pipe(takeUntil(this.$unsub))
      .subscribe((phoneNumber) => {
        this.economicGroupPhoneNumber = phoneNumber;
      });
  }

  private selectGetEconomicGroupPhone() {
    this.store$.dispatch(new AdministrationStoreActions.GetEconomicGroupPhoneAction());
  }

  private selectGetBankingAccount() {
    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(
        new PrepaymentsStoreActions.GetBankingAccountPrepaymentAction({
          uid: this.selectedEstablishmentsUids,
        })
      );
    }
  }

  private selectGetReceivablesSchedule() {
    this.store$.dispatch(
      new PrepaymentsStoreActions.GetReceivablesScheduleGroupingAction({
        uid: this.selectedEstablishmentsUids,
      })
    );
  }

  private selectSaveLead(
    canceled: boolean,
    finished: boolean,
    itStarted: boolean) {

    if (!!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(new PrepaymentsStoreActions.SaveLeadAction(
        {
          canceled,
          uid: this.prepaymentEstablishmentsSelected,
          finished,
          itStarted,
          leadAction: LeadAction.punctualPrepayment
        }));
    }
  }

  private selectFinalizedPunctualPrepayment() {
    this.store$.dispatch(new PrepaymentsStoreActions.FinalizedPunctualPrepaymentAction());
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

          const schedules: FinalizePunctualRequest[] = [];

          this.selection.selected.map(x =>
            schedules.push(
              {
                arScheduleId: x.arScheduleId,
                uid: this.selectedEstablishments.filter(x => x.documentNumber == x.documentNumber)[0].uid
              } as FinalizePunctualRequest
            ))

          this.store$.dispatch(
            new PrepaymentsStoreActions.FinalizePunctualPrepaymentAction({
              uid: this.prepaymentEstablishmentsSelected,
              schedules
            }));
        } else if (data === false) {
          this.openMfaCancelDialog();
        }
      });
  }

  async getBankingAccount() {

    if (!isEmpty(this.bankingAccounts)) {
      console.log("Array:", this.bankingAccounts);
      console.log("Tipo:", typeof this.bankingAccounts);
      console.log("É Array?", Array.isArray(this.bankingAccounts));

      var selectedDoc = this.selectedEstablishments.filter(x => x.uid == this.prepaymentEstablishmentsSelected);

      const resultado = this.bankingAccounts.some((b: any) => b.documentNumber === selectedDoc[0].documentNumber);
      console.log("Resultado:", resultado);

      return this.bankingAccounts
        .filter((b: any) => b.documentNumber === this.selectedEstablishments[0].documentNumber)
        .firstOrDefault((x: BankingAccount) => !!x);
    }

    return {} as BankingAccount;
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
          this.selectSaveLead(true, false, false);
          this.openMfaTwoFactorAuthenticationDialog();
        }
      });
  }

  async onContinueClick() {

    if (!this.selection.hasValue()) {
      this.pop.show();
      return;
    }

    this.pop.hide();

    this.step = 2;
    this.totalAmount = this.selection.selected.sumBy(p => p.totalFreeValue);
    this.sendAnticipate = true;
    this.bankingAccount = await this.getBankingAccount();

    this.store$.dispatch(new PrepaymentsStoreActions.GetPunctualRatePrepaymentAction(
      {
        uid: this.prepaymentEstablishmentsSelected,
        prepaymentTotalAmount: this.totalAmount
      }));
  }

  async onOpenFinalCheckDetail() {

    const config: MatDialogConfig = {
      width: '60vh',
      hasBackdrop: true,
      disableClose: true,
      data: {
        totalAmount: this.totalAmount,
        prepaymentTotalAmount: this.totalAmountPrepayment,
        bankingAccount: await this.getBankingAccount(),
        rate: this.rate,
        schedule: this.selection.selected.firstOrDefault((x: any) => !!x),
        schedules: this.selection.selected,
      }
    };

    const dialogFinalRef = this.dialog.open(DialogPunctualFinalCheckComponent, config);

    dialogFinalRef
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm === true) {
          this.openMfaTwoFactorAuthenticationDialog()
        } if (confirm === false) {
          this.onOpenPunctualCancelDialog();
        }
      });
  }

  async onOpenPunctualCancelDialog() {

    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogPunctualCancelRef = this.dialog.open(DialogPunctualCancelComponent, config);

    dialogPunctualCancelRef
      .afterClosed()
      .subscribe((confirm) => {
        if (!confirm) {
          this.goToPrepayments();
        }
      });
  }

  async openPunctualSuccessDialog() {
    const config: MatDialogConfig = {
      width: '22%',
      hasBackdrop: true,
      disableClose: true,
    };

    const dialogPunctualCancelRef = this.dialog.open(DialogPunctualSuccessComponent, config);

    dialogPunctualCancelRef
      .afterClosed()
      .subscribe((concluido) => {
        this.selectFinalizedPunctualPrepayment();

        if (concluido === true) {
          this.goToPrepayments();
        } else if (concluido === false) {
        } else {
          this.goToPrepayments();
        }
      });
  }

  async goToPrepayments() {
    await this.router.navigate(
      ['/prepayments'],
      {
        queryParams: {
          uid: this.prepaymentEstablishmentsSelected
        }
      });

  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(tablePagination, this.filteredItems);
  }

  onSort({ column, direction }: SortEvent) {
    this.filteredItems = this.tableService.sort({ column, direction }, this.headers, this.filteredItems);
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.originalReceivablesSchedule.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.originalReceivablesSchedule);

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReceivablesSchedule): string {

    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`;
  }

  async openAuthorizationDialog() {
    const config: MatDialogConfig = {
      width: '40%',
      hasBackdrop: true,
      disableClose: false,
      data: {
        establishmentSelected: this.establishmentSelected
      }
    };

    const dialogCancelRef = this.dialog.open(DialogAuthorizationPrepaymentComponent, config);
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }

  async onBackClick() {
    this.step = 1;
  }

  async onConfirmClick() {
    this.openMfaTwoFactorAuthenticationDialog();
  }
}
