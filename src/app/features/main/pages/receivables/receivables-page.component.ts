import { environment as env } from '@/environments/environment';
import {
  AfterContentInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs';
import { FilterSelection as PeriodFilterSelection } from 'src/app/shared/components/period-filter';
import { FilterSelection as ViewByFilterSelection } from 'src/app/shared/components/view-by-filter';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasePage } from '../base.page';
import {
  ReceivablesStoreActions,
  ReceivablesStoreSelectors,
} from './../../../../root-store/receivables-store';
import {
  Receivable,
  ReceivableDetail,
} from './../../../../root-store/receivables-store/receivables.models';
import { AppState } from './../../../../root-store/state';
import { CalendarVisionComponent } from './calendar-vision/calendar-vision.component';
import { DetailVisionComponent } from './detail-vision/detail-vision.component';

@Component({
  templateUrl: './receivables-page.component.html',
  styleUrls: ['./receivables-page.component.scss'],
  standalone: true,
  imports: [DetailVisionComponent, CalendarVisionComponent, SharedModule],
})
export class ReceivablesPageComponent
  extends BasePage
  implements OnInit, AfterContentInit, OnDestroy
{
  @Input() initialDate!: string;
  @Input() finalDate!: string;

  viewBy!: string;
  filterInitialValue!: ViewByFilterSelection;
  periodInitialValue!: PeriodFilterSelection;
  today = new Date().date();

  periodFilter = {
    initialDate: new Date().date().format(),
    finalDate: new Date().date().format(),
  };

  receivablesDetail: ReceivableDetail[] = [];
  filterReceivablesView: ReceivableDetail[] = [];
  pastReceivables: Receivable[] = [];
  customInitialDate!: string;
  customFinalDate!: string;
  receivablesClickHere = env.receivablesClickHere;

  constructor(
    store$: Store<AppState>,
    private route: ActivatedRoute,
    navigationService: NavigationService,
  ) {
    super(store$, navigationService);

    this.viewBy = 'calendar';
    this.periodInitialValue = 'today';
    this.filterInitialValue = 'calendar';
  }

  ngAfterContentInit(): void {
    debugger;
    if (!isEmpty(this.route.snapshot.queryParams)) {
      this.route.queryParams.subscribe((params) => {
        const paramInitialDate = params['initialDate'];
        const paramFinalDate = params['finalDate'];

        this.onViewChange('detail');
        this.periodInitialValue = params['filterName'];
        this.filterInitialValue = 'detail';
        this.customInitialDate = new Date(paramInitialDate).date().format();
        this.customFinalDate = new Date(paramFinalDate).date().format();
      });
    }
  }

  ngOnInit() {
    this.selectLastUpdateDateReceivable();
    this.subscribeReceivablesDetail();
    this.subscribeReceivablesDetailExcel();
  }

  private selectLastUpdateDateReceivable() {
    this.store$.dispatch(
      new ReceivablesStoreActions.SelectLastUpdateDateReceivablesAction(),
    );
  }

  private subscribeReceivablesDetailExcel() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesDetailExcel)
      .pipe(takeUntil(this.$unsub))
      .subscribe((data) => {
        if (!!data) {
          saveAs(data, 'Recebimentos_' + new Date().format('DDMMYYYYHHmmss'));
        }

        this.store$.dispatch(
          new ReceivablesStoreActions.DownloadedReceivablesDetailExcelAction(),
        );
      });
  }

  private subscribeReceivablesDetail() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesDetail) => {
        this.receivablesDetail = receivablesDetail || [];
        this.filterReceivablesView = this.receivablesDetail;
      });
  }

  onViewChange(view: any) {
    this.viewBy = view;
  }

  onExport() {
    this.store$.dispatch(
      new ReceivablesStoreActions.SelectReceivablesDetailExcelAction({
        initialDate: this.periodFilter?.initialDate || '',
        finalDate: this.periodFilter?.finalDate || '',
        uids: this.selectedEstablishmentsUids,
      }),
    );
  }

  onPeriodChange(period: any) {
    if (!!period) {
      this.periodFilter = period;

      this.store$.dispatch(
        new ReceivablesStoreActions.SelectReceivablesDetailAction({
          initialDate: this.periodFilter?.initialDate || '',
          finalDate: this.periodFilter?.finalDate || '',
          uids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }
}
