import { AuthStoreSelectors } from '@/root-store/auth-store';
import { NotificationService } from '@/shared/services/notification.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService, POSITION } from 'ngx-ui-loader';
import { filter, Subject, takeUntil } from 'rxjs';
import { AdministrationStoreSelectors } from './../../../../../root-store/administration-store';
import { Establishment } from './../../../../../root-store/administration-store/administration.models';
import {
  ReportsStoreActions,
  ReportsStoreSelectors,
} from './../../../../../root-store/reports-store';
import {
  EquipmentChip,
  MovementTypeDescription,
  ReportRequest,
  RequestReport,
} from './../../../../../root-store/reports-store/reports.models';
import { AppState } from './../../../../../root-store/state';
import { enumToArray } from './../../../../../shared/extras/enum-helper';
import { SelectOption } from './../../../../../shared/models/select-options';
import { SharedModule } from './../../../../../shared/shared.module';

import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-movements-tab',
  templateUrl: './movements-tab.component.html',
  styleUrls: ['./movements-tab.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class MovementsTabComponent implements OnInit, OnDestroy, OnChanges {
  private $unsub = new Subject();
  lastRequest!: ReportRequest;
  form!: FormGroup;
  LOADER_POSITION = POSITION;
  showEstablishmentRequired = false;
  showAllEstablishments = true;
  showCheckAllEstablishments = true;
  establishments!: Establishment[];
  showEditEstablishments = false;
  customersOptions: SelectOption[] = [];
  showPastPeriod = true;
  movementTypeSelected: MovementTypeDescription = MovementTypeDescription.Sales;
  filterEntriesMovement = enumToArray(MovementTypeDescription);
  userEmail = '';

  periodFilter = {
    initialDate: new Date().date().format(),
    finalDate: new Date().date().format(),
  };

  progressValue: number = 0;
  progressStatus: string = '';
  qtdSales = 0;
  limitDays = 90;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  equipmentsChips: EquipmentChip[] = [];

  showEquipments = false;
  showQtdSales = false;

  constructor(
    private store$: Store<AppState>,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      establishments: [null],
      txtAreaEstablishments: [''],
      editEstablishments: [false],
      allEstablishments: [false],
      txtEquipments: [''],
    });

    this.form
      .get('allEstablishments')
      ?.valueChanges.subscribe((allEstablishments: boolean) => {
        this.form.get('establishments')?.enable();

        if (!!allEstablishments) {
          this.showEstablishmentRequired = false;
          this.form.get('establishments')?.disable();
          this.form.get('establishments')?.patchValue([]);
          this.form.get('editEstablishments')?.setValue(false);
        }
      });

    this.form
      .get('editEstablishments')
      ?.valueChanges.subscribe((editEstablishments: boolean) => {
        this.showAllEstablishments = true;

        if (!!editEstablishments) {
          this.showAllEstablishments = false;
          this.showEstablishmentRequired = false;
          this.form.get('allEstablishments')?.setValue(false);
        }
      });

    this.subscribeAuthData();
    this.subscribeSelectedEstablishments();
    this.subscribeMovementsSalesExcel();
    this.subscribeMovementsReceivablesExcel();
    this.subscribeMovementsAllCardsExcel();
    this.subscribeLastRequest();
    this.selectLastRequest();
  }

  private selectLastRequest() {
    this.store$.dispatch(new ReportsStoreActions.SelectLastRequestAction());
  }

  private selectRequestsReports() {
    this.store$.dispatch(new ReportsStoreActions.SelectRequestsReportsAction());
  }

  private subscribeMovementsReceivablesExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectMovementsReceivablesExcel)
      .pipe(
        takeUntil(this.$unsub),
        filter((excel) => !!excel && !!excel.blob && !!excel.name),
      )
      .subscribe((excel) => {
        saveAs(excel.blob, excel.name);
        this.store$.dispatch(
          new ReportsStoreActions.DownloadedExcelReportsAction(),
        );
      });
  }

  private subscribeMovementsSalesExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectMovementsSalesExcel)
      .pipe(
        takeUntil(this.$unsub),
        filter((excel) => !!excel && !!excel.blob && !!excel.name),
      )
      .subscribe((excel) => {
        saveAs(excel.blob, excel.name);
        this.store$.dispatch(
          new ReportsStoreActions.DownloadedExcelReportsAction(),
        );
      });
  }

  private subscribeMovementsAllCardsExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectMovementsAllCardsExcel)
      .pipe(
        takeUntil(this.$unsub),
        filter((excel) => !!excel && !!excel.blob && !!excel.name),
      )
      .subscribe((excel) => {
        saveAs(excel.blob, excel.name);
        this.store$.dispatch(
          new ReportsStoreActions.DownloadedExcelReportsAction(),
        );
      });
  }

  private subscribeLastRequest() {
    this.store$
      .select(ReportsStoreSelectors.selectLastRequest)
      .pipe(takeUntil(this.$unsub))
      .subscribe((lastRequest) => {
        this.lastRequest = lastRequest;
        this.qtdSales = 0;

        if (!!lastRequest) {
          this.progressValue = lastRequest.progressValue;
          this.progressStatus = lastRequest.progressStatus;
          this.qtdSales = lastRequest.qtdSales;
        }

        if (
          !!this.periodFilter &&
          !!this.periodFilter.finalDate &&
          !!this.periodFilter.initialDate
        ) {
          const diffDays = new Date(this.periodFilter.finalDate).diff(
            new Date(this.periodFilter.initialDate),
            'days',
          );

          if (diffDays > 30) {
            this.notificationService.showSuccess(
              'O seu relatório foi solicitado com sucesso, quando finalizar você poderá fazer o download via Portal Minha Conta/APP ou via e-mail.',
            );
          }
        }
      });
  }

  private subscribeSelectedEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        this.establishments = establishments;
        this.showCheckAllEstablishments = true;
        this.showAllEstablishments = true;

        if (!!this.establishments) {
          this.customersOptions = [
            ...this.establishments.map(
              (establishment) =>
                new SelectOption(
                  `${establishment.documentNumber} - ${establishment.companyName}`,
                  establishment.uid,
                ),
            ),
          ];

          if (!!establishments.length && establishments.length === 1) {
            this.showCheckAllEstablishments = false;
            this.showAllEstablishments = false;

            this.form.patchValue({
              establishments: establishments.map((x) => x.uid),
            });
          }
        }
      });
  }

  private subscribeAuthData() {
    this.store$
      .select(AuthStoreSelectors.selectAuthData)
      .pipe(takeUntil(this.$unsub))
      .subscribe((authData) => {
        if (!!authData?.user?.email) {
          this.userEmail = authData?.user?.email;
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lastRequest = changes['lastRequest'].currentValue;
    this.showValues();
  }

  onPeriodChange(period: any) {
    this.periodFilter = period;
  }

  downloadExcel(id: any, movementType: any) {
    if (
      !!this.lastRequest &&
      this.lastRequest.grossValue === 0 &&
      this.lastRequest.qtdSales === 0
    ) {
      this.notificationService.showWarning(
        'Nenhuma transação encontrada para exportação referente aos filtros selecionados.',
      );
      return;
    }

    if (movementType === 1) {
      this.store$.dispatch(
        new ReportsStoreActions.SelectMovementsSalesReportsExcelAction({ id }),
      );
    } else if (movementType === 2) {
      this.store$.dispatch(
        new ReportsStoreActions.SelectMovementsReceivablesReportsExcelAction({
          id,
        }),
      );
    } else {
      this.store$.dispatch(
        new ReportsStoreActions.SelectMovementsAllCardsReportsExcelAction({
          id,
        }),
      );
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const {
      establishments,
      allEstablishments,
      editEstablishments,
      txtAreaEstablishments,
    } = this.form.getRawValue() as {
      establishments: string[];
      allEstablishments: boolean;
      txtAreaEstablishments: string;
      editEstablishments: boolean;
    };

    if (editEstablishments && !(txtAreaEstablishments || []).length) {
      this.showEstablishmentRequired = true;
      return;
    }

    if (
      !editEstablishments &&
      !allEstablishments &&
      !(establishments || []).length
    ) {
      this.showEstablishmentRequired = true;
      return;
    }

    this.showEstablishmentRequired = false;

    let uids: string[] = [];

    uids = establishments;

    if (!!txtAreaEstablishments && (txtAreaEstablishments || []).length) {
      uids = txtAreaEstablishments
        .replace('.', '')
        .replace('-', '')
        .replace('/', '')
        .replace(',', '')
        .split(';');
    }

    if (allEstablishments) {
      uids = this.establishments.map((c) => c.uid);
    }

    let equipments: string[] = [];
    if (!!this.equipmentsChips && (this.equipmentsChips || []).length) {
      equipments = this.equipmentsChips.map((c) => c.name);
    }

    const initialDate = !!this.periodFilter.initialDate
      ? new Date(this.periodFilter.initialDate).date()
      : new Date().date();

    const finalDate = !!this.periodFilter.finalDate
      ? new Date(this.periodFilter.finalDate).date().addDays(1).addSeconds(-1)
      : new Date().date().addDays(1).addSeconds(-1);

    const establishmentsToPush = uids.map((uid) => {
      const { email } = this.establishments.find((e) => e.uid === uid)!;

      return {
        uid,
        email,
      };
    });

    const request = {
      initialDate: initialDate.format(),
      finalDate: finalDate.format(),
      uids,
      establishmentsToPush,
      equipments,
    } as RequestReport;

    if (this.movementTypeSelected === MovementTypeDescription.Sales) {
      this.store$.dispatch(
        new ReportsStoreActions.RequestSalesReportsAction({ request: request }),
      );
    } else if (
      this.movementTypeSelected === MovementTypeDescription.Receivables
    ) {
      this.store$.dispatch(
        new ReportsStoreActions.RequestReceivablesReportsAction({
          request: request,
        }),
      );
    } else {
      this.store$.dispatch(
        new ReportsStoreActions.RequestAllCardsReportsAction({
          request: request,
        }),
      );
    }

    let showOneEstablishment =
      !!establishments.length && establishments.length === 1;

    this.form.patchValue({
      movementType: MovementTypeDescription.Receivables,
      establishments: showOneEstablishment
        ? this.establishments.map((x) => x.uid)
        : [],
      allEstablishments: !showOneEstablishment,
      txtAreaEstablishments: '',
    });

    this.equipmentsChips = [];

    this.selectLastRequest();
    this.selectRequestsReports();
  }

  showValues(): boolean {
    if (!!this.lastRequest) {
      const statusLastRequest = this.lastRequest.status;

      switch (statusLastRequest) {
        case 1:
        case 2: {
          // this.ngxService.startLoader('loader_net_value');
          // this.ngxService.startLoader('loader_gross_value');
          // this.ngxService.startLoader('loader_qtd_sales');
          return false;
        }
        default:
          return true;
      }
    }

    return false;
  }

  onMovementTypeChange(event: any) {
    this.showPastPeriod =
      event.value === MovementTypeDescription.Sales ||
      event.value === MovementTypeDescription.AllCards;

    this.limitDays = 90;
    this.showEquipments = false;
    this.showQtdSales = false;

    if (event.value === MovementTypeDescription.AllCards) {
      // Premissa que nesse tipo de movimento, seja limitado a 30 dias.
      this.limitDays = 30;
      this.showEquipments = true;
      this.showQtdSales = true;
    }

    this.movementTypeSelected = event.value;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our equipment
    if (value) {
      this.equipmentsChips.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(equipment: EquipmentChip): void {
    const index = this.equipmentsChips.indexOf(equipment);

    if (index >= 0) {
      this.equipmentsChips.splice(index, 1);
    }
  }

  edit(equipment: EquipmentChip, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove equipment if it no longer has a name
    if (!value) {
      this.remove(equipment);
      return;
    }

    // Edit existing fruit
    const index = this.equipmentsChips.indexOf(equipment);
    if (index >= 0) {
      this.equipmentsChips[index].name = value;
    }
  }
}
