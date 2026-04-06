import { ReportRequest } from '@/root-store/reports-store/reports.models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs';
import { AdministrationStoreSelectors } from 'src/app/root-store/administration-store';
import { ReportsStoreActions } from 'src/app/root-store/reports-store';
import { ReportsHubService } from 'src/app/root-store/reports-store/reports-hub.service';
import { AppState } from 'src/app/root-store/state';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasePage } from '../base.page';
import { HistoricTabComponent } from './historic-tab/historic-tab.component';
import { MovementsTabComponent } from './movements-tab/movements-tab.component';

@Component({
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  standalone: true,
  imports: [HistoricTabComponent, MovementsTabComponent, NgxUiLoaderModule, SharedModule]
})
export class ReportsPageComponent extends BasePage implements OnInit, OnDestroy {
  activeTabIndex = 0;

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    private reportsHubService: ReportsHubService
  ) {
    super(store$, navigationService);
  }

  ngOnInit() {
    this.subscribeSelectedEstablishmentsDocuments();

    this.selectLastRequest();
  }

  private selectLastRequest() {
    this.store$.dispatch(new ReportsStoreActions.SelectLastRequestAction());
  }

  private subscribeSelectedEstablishmentsDocuments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        this.reportsHubService.listenToReportUpdates().subscribe({
          next: (result: ReportRequest) => {
            console.log('Atualização recebida:', result);
            this.store$.dispatch(new ReportsStoreActions.OnUpdateRequestReportsAction({ result }));
          },
          error: (err) => {
            console.error('Erro ao escutar atualizações:', err);
          }
        });
      });
  }
}
