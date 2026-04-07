import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { filter, Subject, takeUntil } from 'rxjs';
import { AdministrationStoreSelectors } from './../../../../../root-store/administration-store';
import { Establishment } from './../../../../../root-store/administration-store/administration.models';
import { AppState } from './../../../../../root-store/state';
import {
  StatementsStoreActions,
  StatementsStoreSelectors,
} from './../../../../../root-store/statements-store';
import {
  StatementScheduling,
  StatementSchedulingRequest,
} from './../../../../../root-store/statements-store/statements.models';
import { TableService } from './../../../../../shared/components/table';
import { FormValidators } from './../../../../../shared/extras/form-validators';
import { SelectOption } from './../../../../../shared/models/select-options';
import { TablePagination } from './../../../../../shared/models/table.model';
import { NotificationService } from './../../../../../shared/services/notification.service';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  templateUrl: './dialog-statements-scheduling.component.html',
  styleUrls: ['./dialog-statements-scheduling.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogStatementsSchedulingComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  form!: FormGroup;

  selectedEstablishmentsUids!: string[];

  fileNameToDownload = '';
  customersOptions: SelectOption[] = [];
  showEstablishmentRequired = false;
  showAllEstablishments = true;
  showCheckAllEstablishments = true;
  establishments!: Establishment[];
  maxDate: Date;
  dateFormat!: string;
  submitted = false;
  tablePage = 1;
  itemsPerPage = 7;

  schedulings: StatementScheduling[] = [];
  dataSource: StatementScheduling[] = [];
  columnsToDisplay = ['createdDate', 'period', 'documentNumber'];

  constructor(
    private store$: Store<AppState>,
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    bsLocaleService: BsLocaleService,
    private notificationService: NotificationService,
    private tableService: TableService,
  ) {
    bsLocaleService.use('pt-br');

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 6);

    this.maxDate = newDate;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      establishments: [null],
      allEstablishments: [false],
      dateRange: [[], [Validators.required]],
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

    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        this.establishments = establishments;
        this.showCheckAllEstablishments = true;

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
            this.form.patchValue({
              establishments: establishments.map((x) => x.uid),
            });
          }
        }
      });

    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)
      .pipe(takeUntil(this.$unsub))
      .subscribe((selectedUids) => {
        this.selectedEstablishmentsUids = selectedUids;

        this.store$.dispatch(
          new StatementsStoreActions.SelectStatementsAction({
            uids: this.selectedEstablishmentsUids,
          }),
        );

        if (!isEmpty(this.selectedEstablishmentsUids)) {
          this.store$.dispatch(
            new StatementsStoreActions.SelectLastStatementsSchedulingAction({
              uids: this.selectedEstablishmentsUids,
            }),
          );
        }
      });

    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileTxt)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((txt) => {
        saveAs(txt, `${this.fileNameToDownload}.txt`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileTxtAction(),
        );
        this.fileNameToDownload = '';
      });

    this.store$
      .select(StatementsStoreSelectors.selectStatementsFileXml)
      .pipe(
        takeUntil(this.$unsub),
        filter((statementFile) => !!statementFile),
      )
      .subscribe((xml) => {
        saveAs(xml, `${this.fileNameToDownload}.xml`);
        this.store$.dispatch(
          new StatementsStoreActions.DownloadedStatementsFileXmlAction(),
        );
        this.fileNameToDownload = '';
      });

    this.store$
      .select(StatementsStoreSelectors.selectLastStatementsScheduling)
      .pipe(takeUntil(this.$unsub))
      .subscribe((schedulings) => {
        this.schedulings = [...schedulings];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      });

    this.store$
      .select(StatementsStoreSelectors.selectAddStatementsScheduling)
      .pipe(takeUntil(this.$unsub))
      .subscribe((schedulings) => {
        if (!!schedulings)
          this.notificationService.showSuccess('Agendamento realizado');
        this.store$.dispatch(
          new StatementsStoreActions.AddedSchedulingStatementAction(),
        );
      });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  downloadTxt(fileName: any) {
    this.fileNameToDownload = fileName;
    this.store$.dispatch(
      new StatementsStoreActions.SelectStatementsFileTxtAction({ fileName }),
    );
  }

  downloadXml(fileName: any) {
    this.fileNameToDownload = fileName;
    this.store$.dispatch(
      new StatementsStoreActions.SelectStatementsFileXmlAction({ fileName }),
    );
  }

  onCancellClick(): void {
    this.bsModalRef.hide();
  }

  onSchedulingClick() {
    FormValidators.checkFormValidations(this.form);

    const { establishments, allEstablishments, dateRange } =
      this.form.getRawValue() as {
        establishments: string[];
        allEstablishments: boolean;
        dateRange: any[];
      };

    if (this.form.invalid) {
      this.submitted = true;
      this.showEstablishmentRequired = !(establishments || []).length;
      return;
    }

    if (!(establishments || []).length) {
      this.showEstablishmentRequired = true;
      this.submitted = true;
      return;
    }

    this.submitted = false;
    this.showEstablishmentRequired = false;

    let establishmentsUids = establishments;

    if (allEstablishments) {
      establishmentsUids = this.establishments.map((c) => c.uid);
    }

    const initialDate = !!dateRange[0]
      ? new Date(dateRange[0]).date().format()
      : new Date().date().format();

    const finalDate = !!dateRange[1]
      ? new Date(dateRange[1]).date().addDays(1).addSeconds(-1).format()
      : new Date().date().addDays(1).addSeconds(-1).format();

    const request = {
      initialDate,
      finalDate,
      uids: establishmentsUids,
    } as StatementSchedulingRequest;

    this.store$.dispatch(
      new StatementsStoreActions.AddSchedulingStatementAction({ request }),
    );

    let showOneEstablishment =
      !!establishments.length && establishments.length === 1;

    this.form.patchValue({
      establishments: showOneEstablishment ? establishments : [],
      allEstablishments: false,
      dateRange: [],
    });

    this.store$.dispatch(
      new StatementsStoreActions.SelectLastStatementsSchedulingAction({
        uids: establishmentsUids,
      }),
    );
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(
      tablePagination,
      this.schedulings,
    );
  }
}
