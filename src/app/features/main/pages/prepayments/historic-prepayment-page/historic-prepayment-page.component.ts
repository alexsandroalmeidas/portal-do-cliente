import { AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from 'src/app/root-store/prepayments-store';
import { GetHistoricItemResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { AppState } from 'src/app/root-store/state';
import { FilterSelection as DateFilterSelection } from 'src/app/shared/components/date-filter';
import { SortableHeaderDirective, SortEvent, TableService } from 'src/app/shared/components/table';
import { TablePagination } from 'src/app/shared/models/table.model';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasePage } from '../../base.page';

@Component({
  selector: 'app-historic-prepayment-page',
  templateUrl: './historic-prepayment-page.component.html',
  styleUrls: ['./historic-prepayment-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class HistoricPrepaymentPageComponent extends BasePage implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  historic: GetHistoricItemResponse[] = [];
  filteredItems: GetHistoricItemResponse[] = [];
  dataSource: GetHistoricItemResponse[] = [];
  columnsToDisplay = [
    'status',
    'prepaymentValue',
    'isPunctual',
    'registrationDate',
    'code',
    'channel'
  ];
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;
  page?: number;
  periodInitialValue: DateFilterSelection = 'week';
  periodFilter = null as any;
  customInitialDate!: string;
  customFinalDate!: string;

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

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
    this.customInitialDate = new Date().addDays(-7).date().format();
    this.customFinalDate = new Date().date().format();

    this.periodFilter = {
      initialDate: this.customInitialDate,
      finalDate: this.customFinalDate,
    };
    this.selectGetHistoric();

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const itens: string = changes['prepaymentEstablishmentsSelected'].currentValue;

    this.subscribeGetHistoric();
  }

  private selectGetHistoric() {

    if (!!this.periodFilter && !!this.prepaymentEstablishmentsSelected) {
      this.store$.dispatch(new PrepaymentsStoreActions.GetHistoricAction(
        {
          uid: this.prepaymentEstablishmentsSelected,
          initialDate: this.periodFilter.initialDate || '',
          finalDate: this.periodFilter.finalDate || '',
        }));
    }
  }

  private subscribeGetHistoric() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectHistoric)
      .pipe(takeUntil(this.$unsub))
      .subscribe((historic) => {
        this.historic = historic || [];
        this.filteredItems = [...this.historic];
        this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
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

  onPeriodChange(period: any) {
    if (!!period) {
      this.periodFilter = period;
      this.selectGetHistoric();
    }
  }
}