import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  SortableHeaderDirective,
  SortEvent,
  TableService,
} from 'src/app/shared/components/table';
import { TablePagination } from 'src/app/shared/models/table.model';
import { SummaryLastSales } from './../../../../../root-store/sales-store/sales.models';
import { SharedModule } from './../../../../../shared/shared.module';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-my-sales-detail-vision',
  templateUrl: './my-sales-detail-vision.component.html',
  styleUrls: ['./my-sales-detail-vision.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  standalone: true,
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MySalesDetailVisionComponent implements OnDestroy, OnChanges {
  private $unsub = new Subject();
  @Input() filterSales: SummaryLastSales[] = [];
  @Output() export = new EventEmitter();

  columnsToDisplay = [
    'documentNumber',
    'saleDate',
    'saleAmount',
    'paymentAmount',
    'cardBrand',
    'paymentType',
    'nsu',
    'status',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: SummaryLastSales | null;

  dataSource: SummaryLastSales[] = [];
  filteredItems: SummaryLastSales[] = [];
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;
  page?: number;
  totalItems: number = 0;

  @ViewChildren(SortableHeaderDirective)
  headers!: QueryList<SortableHeaderDirective>;

  constructor(
    private tableService: TableService,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    let filterSales = Array.from<SummaryLastSales>(
      changes['filterSales']?.currentValue ?? [],
    );

    filterSales = filterSales
      .filter((x) => !x.isCancelled)
      ?.sortBy((x) => x.saleDate)
      .reverse();

    this.totalItems = filterSales.length;
    this.filteredItems = [...filterSales];
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onExport() {
    this.export.emit();
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(
      tablePagination,
      this.filteredItems,
    );
  }

  onSort({ column, direction }: SortEvent) {
    this.filteredItems = this.tableService.sort(
      { column, direction },
      this.headers,
      this.filteredItems,
    );
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  private stopLoader(loaderId: string) {
    setTimeout(() => {
      this.ngxService.stopLoader(loaderId);
    });
  }
}
