import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { isEmpty } from 'lodash';
import { NgxUiLoaderService, POSITION } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { SummaryCardSales } from './../../../../../root-store/sales-store/sales.models';
import {
  FilterOption,
  SelectedOption,
} from './../../../../../shared/components/inline-filter';
import { DateRange } from './../../../../../shared/models/date';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-card-my-sales',
  templateUrl: './card-my-sales.component.html',
  styleUrls: ['./card-my-sales.component.scss'],
  standalone: true,
  imports: [SharedModule, TooltipComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardMySalesComponent implements OnInit, OnChanges {
  $unsub = new Subject();
  @Input() lastUpdateDate!: Date;
  @Input() hasError = false;
  @Input() sales?: SummaryCardSales = {} as SummaryCardSales;
  @Output() periodChange!: EventEmitter<DateRange>;

  LOADER_POSITION = POSITION;

  totalAmount: number = 0;
  totalCount: number = 0;

  debitAmount: number = 0;
  debitAmountPercent: number = 0;
  debitCount: number = 0;
  debitCountPercent: number = 0;

  creditAmount: number = 0;
  creditAmountPercent: number = 0;
  creditCount: number = 0;
  creditCountPercent: number = 0;

  voucherAmount: number = 0;
  voucherAmountPercent: number = 0;
  voucherCount: number = 0;
  voucherCountPercent: number = 0;

  pixAmount: number = 0;
  pixAmountPercent: number = 0;
  pixCount: number = 0;
  pixCountPercent: number = 0;

  approvedCount: number = 0;
  approvedAmount: number = 0;

  today = new Date().date();
  currentFilterName!: string;
  currentFilter: DateRange = {
    from: this.today,
    to: this.today,
    update: true,
  };

  filterOptions = [
    new FilterOption('Hoje', 'today', (): DateRange => {
      return {
        from: this.today,
        to: this.today,
        update: true,
      };
    }),
    new FilterOption('Últimos 7 dias', 'lastWeek', (): DateRange => {
      return {
        from: this.today.addDays(-7),
        to: this.today,
        update: true,
      };
    }),
    new FilterOption('Últimos 30 dias', 'lastMonth', (): DateRange => {
      return {
        from: this.today.addDays(-30),
        to: this.today,
        update: true,
      };
    }),
  ];

  constructor(private ngxService: NgxUiLoaderService) {
    this.periodChange = new EventEmitter<DateRange>();
  }

  ngOnInit() {
    this.totalAmount = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let sales = changes['sales']?.currentValue;

    if (isEmpty(sales)) {
      sales = {
        approvedAmount: 0,
        approvedCount: 0,
        creditAmount: 0,
        creditAmountPercent: (0).toFixedString(2),
        creditCount: 0,
        creditPercent: (0).toFixedString(2),
        debitAmount: 0,
        debitAmountPercent: (0).toFixedString(2),
        debitCount: 0,
        debitPercent: (0).toFixedString(2),
        totalAmount: 0,
        totalCount: 0,
        voucherAmount: 0,
        voucherAmountPercent: (0).toFixedString(2),
        voucherCount: 0,
        voucherCountPercent: (0).toFixedString(2),
      } as SummaryCardSales;
    }

    this.totalAmount = sales.totalAmount;
    this.totalCount = sales.totalCount;

    this.totalAmount = sales.totalAmount;
    this.totalCount = sales.totalCount;

    this.debitAmount = sales.debitAmount;
    this.debitAmountPercent = sales.debitAmountPercent;
    this.debitCount = sales.debitCount;
    this.debitCountPercent = sales.debitCountPercent;

    this.creditAmount = sales.creditAmount;
    this.creditAmountPercent = sales.creditAmountPercent;
    this.creditCount = sales.creditCount;
    this.creditCountPercent = sales.creditCountPercent;

    this.pixAmount = sales.pixAmount;
    this.pixAmountPercent = sales.pixAmountPercent;
    this.pixCount = sales.pixCount;
    this.pixCountPercent = sales.pixCountPercent;

    this.voucherAmount = sales.voucherAmount;
    this.voucherAmountPercent = sales.voucherAmountPercent;
    this.voucherCount = sales.voucherCount;
    this.voucherCountPercent = sales.voucherCountPercent;

    this.approvedCount = sales.approvedCount;
    this.approvedAmount = sales.approvedAmount;

    this.stopLoader('loader_summary_card_sales');
  }

  onFilterChange(filters: SelectedOption[]): void {
    this.currentFilter = filters[0].value;
    this.getCurrentFilterName(filters);

    this.periodChange.emit(this.currentFilter);
  }

  private getCurrentFilterName(filters: SelectedOption[]) {
    this.currentFilterName =
      filters[0].name === 'lastWeek'
        ? 'weekly'
        : filters[0].name === 'lastMonth'
          ? 'monthly'
          : filters[0].name;
  }

  private stopLoader(loaderId: string) {
    setTimeout(() => {
      this.ngxService.stopLoader(loaderId);
    });
  }
}
