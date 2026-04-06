import { NotificationService } from '@/shared/services/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  ReportsStoreActions,
  ReportsStoreSelectors,
} from './../../../../../root-store/reports-store';
import { ReportRequest } from './../../../../../root-store/reports-store/reports.models';
import { AppState } from './../../../../../root-store/state';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-historic-tab',
  templateUrl: './historic-tab.component.html',
  styleUrls: ['./historic-tab.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class HistoricTabComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  dataSource: ReportRequest[] = [];

  columnsToDisplay = [
    'requested',
    'initialDate',
    'movementTypeDescription',
    'documents',
    'equipments',
    'progressStatus',
    'action',
  ];

  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.subscribeRequests();
    this.subscribeHistoricSalesExcel();
    this.subscribeHistoricAllCardsExcel();
    this.subscribeHistoricReceivablesExcel();
    this.selectRequestsReports();
  }

  private subscribeRequests() {
    this.store$
      .select(ReportsStoreSelectors.selectRequests)
      .pipe(
        takeUntil(this.$unsub),
        filter((requests) => !isEmpty(requests)),
      )
      .subscribe((requests) => {
        this.dataSource = requests || [];
      });
  }

  private selectRequestsReports() {
    this.store$.dispatch(new ReportsStoreActions.SelectRequestsReportsAction());
  }

  private subscribeHistoricReceivablesExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectHistoricReceivablesExcel)
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

  private subscribeHistoricSalesExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectHistoricSalesExcel)
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

  private subscribeHistoricAllCardsExcel() {
    this.store$
      .select(ReportsStoreSelectors.selectHistoricAllCardsExcel)
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

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  downloadExcel(row: any) {
    if (!!row && row.grossValue === 0 && row.qtdSales === 0) {
      this.notificationService.showWarning(
        'Nenhuma transação encontrada para exportação referente aos filtros selecionados.',
      );
      return;
    }

    if (row.movementType === 1) {
      this.store$.dispatch(
        new ReportsStoreActions.SelectHistoricSalesReportsExcelAction({
          id: row.id,
        }),
      );
    } else if (row.movementType === 2) {
      this.store$.dispatch(
        new ReportsStoreActions.SelectHistoricReceivablesReportsExcelAction({
          id: row.id,
        }),
      );
    } else {
      this.store$.dispatch(
        new ReportsStoreActions.SelectHistoricAllCardsReportsExcelAction({
          id: row.id,
        }),
      );
    }
  }
}
