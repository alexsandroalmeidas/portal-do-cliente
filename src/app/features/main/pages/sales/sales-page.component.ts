import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { BasePage } from '../base.page';
import {
  SalesStoreActions,
  SalesStoreSelectors,
} from './../../../../root-store/sales-store';
import { SalesDetail } from './../../../../root-store/sales-store/sales.models';
import { AppState } from './../../../../root-store/state';
import { FilterSelection as PeriodFilterFilterSelection } from './../../../../shared/components/period-filter/models';
import { FilterSelection } from './../../../../shared/components/view-by-filter/models';
import { DateRange } from './../../../../shared/models/date';
import { SharedModule } from './../../../../shared/shared.module';
import { CalendarVisionComponent } from './calendar-vision/calendar-vision.component';
import { DetailVisionComponent } from './detail-vision/detail-vision.component';

@Component({
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.scss'],
  standalone: true,
  imports: [DetailVisionComponent, CalendarVisionComponent, SharedModule],
})
export class SalesPageComponent
  extends BasePage
  implements OnInit, AfterContentInit, OnDestroy
{
  viewBy!: string;
  sales: SalesDetail[] = [];
  filterInitialValue!: FilterSelection;
  periodInitialValue!: PeriodFilterFilterSelection;
  today = new Date().date();

  periodFilter = {
    initialDate: new Date().date().format(),
    finalDate: new Date().date().format(),
  };
  customInitialDate!: string;
  customFinalDate!: string;

  @Output() periodChange!: EventEmitter<DateRange>;

  constructor(
    store$: Store<AppState>,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    navigationService: NavigationService,
  ) {
    super(store$, navigationService);

    this.viewBy = 'calendar';
    this.periodInitialValue = 'today';
    this.filterInitialValue = 'calendar';

    this.periodChange = new EventEmitter<DateRange>();
  }

  ngAfterContentInit(): void {
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
    this.subscribeSalesDetailExcel();
    this.subscribeSalesDetail();
  }

  private subscribeSalesDetailExcel() {
    this.store$
      .select(SalesStoreSelectors.selectSalesDetailExcel)
      .pipe(takeUntil(this.$unsub))
      .subscribe((data) => {
        if (!!data) {
          saveAs(data, 'Vendas_' + new Date().format('DDMMYYYYHHmmss'));
        }

        this.store$.dispatch(
          new SalesStoreActions.DownloadedSalesDetailExcelAction(),
        );
      });
  }

  private subscribeSalesDetail() {
    this.store$
      .select(SalesStoreSelectors.selectSalesDetail)
      .pipe(takeUntil(this.$unsub))
      .subscribe((salesDetail) => {
        this.sales = salesDetail || [];
      });
  }

  onViewChange(view: any) {
    this.viewBy = view;
  }

  onExport() {
    this.store$.dispatch(
      new SalesStoreActions.SelectSalesDetailExcelAction({
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
        new SalesStoreActions.SelectSalesDetailAction({
          initialDate: this.periodFilter?.initialDate || '',
          finalDate: this.periodFilter?.finalDate || '',
          uids: this.selectedEstablishmentsUids,
        }),
      );
    }
  }
}
