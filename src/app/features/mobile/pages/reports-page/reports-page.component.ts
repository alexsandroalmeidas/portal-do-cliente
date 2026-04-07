import { AdministrationStoreSelectors } from '@/root-store/administration-store';
import { ReportsHubService } from '@/root-store/reports-store/reports-hub.service';
import { MedalliaService } from '@/shared/services/medallia.service';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { filter, takeUntil } from 'rxjs';
import { ToolbarBackgroundComponent } from '../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import {
  ReportsStoreActions,
  ReportsStoreSelectors,
} from './../../../../root-store/reports-store';
import {
  MovementType,
  ReportRequest,
  RequestReport,
} from './../../../../root-store/reports-store/reports.models';
import { AppState } from './../../../../root-store/state';
import { NavigationService } from './../../../../shared/services/navigation.service';
import { SharedModule } from './../../../../shared/shared.module';
import { AddSchedulingReportDialogComponent } from './components/add-scheduling-report-dialog/add-scheduling-report-dialog.component';
import { ReportDetailDialogComponent } from './components/report-detail-dialog/report-detail-dialog.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    ReportDetailDialogComponent,
    ToolbarBackgroundComponent,
  ],
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
})
export class ReportsPageComponent extends MobileBasePage implements OnInit {
  requests: ReportRequest[] = [];
  detailedRequest?: ReportRequest;

  @ViewChild('requestDetailRef') private requestDetailRef!: TemplateRef<any>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router,
    private reportsHubService: ReportsHubService,
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

    this.subscribeSelectedEstablishmentsDocuments();
    this.subscribeMovementsSalesExcel();
    this.subscribeMovementsReceivablesExcel();
    this.subscribeMovementsAllCardsExcel();
    this.subscribeRequests();
  }

  private selectRequestsReports() {
    this.store$.dispatch(new ReportsStoreActions.SelectRequestsReportsAction());
  }

  ngOnInit(): void {
    this.selectRequestsReports();
  }

  onAddReportRequest() {
    const bottomSheetRef = this.bottomSheet.open(
      AddSchedulingReportDialogComponent,
      {
        panelClass: 'bottom-sheet-panel',
        hasBackdrop: true,
        disableClose: true,
        data: {},
      },
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(takeUntil(this.$unsub))
      .subscribe(
        (filter: {
          range: { start: Date; end: Date };
          movementType: MovementType;
          equipments: string[];
        }) => {
          const { range, movementType, equipments } = filter;
          const { start, end } = range;

          const request: RequestReport = {
            userId: '',
            initialDate: start.format(),
            finalDate: end.format(),
            uids: this.selectedEstablishmentsUids,
            establishmentsToPush: [],
            equipments,
          };

          if (movementType === MovementType.Sales) {
            this.store$.dispatch(
              new ReportsStoreActions.RequestSalesReportsAction({ request }),
            );
          } else if (movementType === MovementType.Receivables) {
            this.store$.dispatch(
              new ReportsStoreActions.RequestReceivablesReportsAction({
                request,
              }),
            );
          } else {
            this.store$.dispatch(
              new ReportsStoreActions.RequestAllCardsReportsAction({ request }),
            );
          }

          this.selectRequestsReports();
        },
      );
  }

  async onDetailReport(request: ReportRequest) {
    this.detailedRequest = request;
    await this.sidenavService.open(this.requestDetailRef);
  }

  async onCloseDetailReport() {
    this.detailedRequest = undefined;
    await this.sidenavService.close();
  }

  async onDownloadExcel() {
    await this.sidenavService.close();

    if (this.detailedRequest) {
      const { id, movementType } = this.detailedRequest;

      if (movementType === MovementType.Sales) {
        this.store$.dispatch(
          new ReportsStoreActions.SelectMovementsSalesReportsExcelAction({
            id: id,
          }),
        );
      } else if (movementType === MovementType.Receivables) {
        this.store$.dispatch(
          new ReportsStoreActions.SelectMovementsReceivablesReportsExcelAction({
            id: id,
          }),
        );
      } else {
        this.store$.dispatch(
          new ReportsStoreActions.SelectMovementsAllCardsReportsExcelAction({
            id: id,
          }),
        );
      }

      this.detailedRequest = undefined;
    }
  }

  private subscribeRequests() {
    this.store$
      .select(ReportsStoreSelectors.selectRequests)
      .pipe(
        takeUntil(this.$unsub),
        filter((requests) => !!requests && !!requests.length),
      )
      .subscribe((requests) => {
        this.requests = requests || [];
      });
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

  private subscribeSelectedEstablishmentsDocuments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        this.reportsHubService.listenToReportUpdates().subscribe({
          next: (result: ReportRequest) => {
            console.log('Atualização recebida:', result);
            this.store$.dispatch(
              new ReportsStoreActions.OnUpdateRequestReportsAction({ result }),
            );
          },
          error: (err) => {
            console.error('Erro ao escutar atualizações:', err);
          },
        });
      });
  }
}
