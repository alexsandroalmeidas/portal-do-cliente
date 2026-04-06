import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { debounceTime, startWith, Subject, takeUntil } from 'rxjs';
import {
  SalesDetail,
  SummarySales,
} from './../../../../../root-store/sales-store/sales.models';
import {
  SortableHeaderDirective,
  SortEvent,
  TableService,
} from './../../../../../shared/components/table';
import { SelectOption } from './../../../../../shared/models/select-options';
import { TablePagination } from './../../../../../shared/models/table.model';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-detail-vision',
  templateUrl: './detail-vision.component.html',
  styleUrls: ['./detail-vision.component.scss'],
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
})
export class DetailVisionComponent implements OnDestroy, OnChanges {
  private $unsub = new Subject();
  form!: FormGroup;

  @Input() filterSales: SalesDetail[] = [];
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
  expandedElement!: SalesDetail | null;

  dataSource: SalesDetail[] = [];
  filteredItems: SalesDetail[] = [];
  summarySales: SummarySales[] = [];
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;
  page?: number;

  totalAmount: number = 0;
  totalCount: number = 0;

  cardBrandsOptions: SelectOption[] = [];
  filterCardBrandsOptions: SelectOption[] = [];

  paymentTypesOptions: SelectOption[] = [];
  filterPaymentTypesOptions: SelectOption[] = [];

  statusOptions: SelectOption[] = [];
  filterStatusOptions: SelectOption[] = [];

  filterNsu: string = '';
  filterSaleTime: string = '';

  get formControls() {
    return this.form.controls;
  }
  get totalCards() {
    return this.summarySales.length;
  }

  @ViewChildren(SortableHeaderDirective)
  headers!: QueryList<SortableHeaderDirective>;

  constructor(
    private formBuilder: FormBuilder,
    private tableService: TableService,
  ) {
    this.form = formBuilder.group({
      saleTime: [null],
      nsu: [null],
    });
  }

  ngOnInit(): void {
    this.formControls['saleTime'].valueChanges.subscribe((saleTime: any) => {
      this.filterSaleTime = saleTime;
      this.filteringSales();
    });

    this.formControls['nsu'].valueChanges
      .pipe(takeUntil(this.$unsub), debounceTime(500), startWith(''))
      .subscribe((nsu: any) => {
        this.filterNsu = nsu;
        this.filteringSales();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let filterSales = Array.from<SalesDetail>(
      changes['filterSales']?.currentValue ?? [],
    );

    filterSales = filterSales?.sortBy((x) => x.saleDate).reverse();

    this.sumarizeAll(filterSales);

    if (!isEmpty(filterSales)) {
      const cardBrands = [
        ...new Set(
          filterSales.map(
            (item) => new SelectOption(item.cardBrand, item.cardBrand),
          ),
        ),
      ];

      this.cardBrandsOptions = cardBrands.filter(
        (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i,
      );

      const paymentTypes = [
        ...new Set(
          filterSales.map(
            (item) => new SelectOption(item.paymentType, item.paymentType),
          ),
        ),
      ];

      this.paymentTypesOptions = paymentTypes.filter(
        (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i,
      );

      const status = [
        ...new Set(
          filterSales.map((item) => new SelectOption(item.status, item.status)),
        ),
      ];

      this.statusOptions = status.filter(
        (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i,
      );
    }

    this.filteredItems = [...filterSales];
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  sumarizeAll(sales: SalesDetail[]) {
    this.summarySales = [];

    const salesWithoutDenied = sales?.filter(
      (s) => s.status !== 'Negada' && s.status !== 'Desfeita',
    );

    this.sumarizeTotal(salesWithoutDenied);
    this.sumarizeCredit(salesWithoutDenied);
    this.sumarizeInternationalCredit(salesWithoutDenied);
    this.sumarizeInstallments(salesWithoutDenied);
    this.sumarizePrepaidCredit(salesWithoutDenied);
    this.sumarizePrepaidDebit(salesWithoutDenied);
    this.sumarizeDebit(salesWithoutDenied);
    this.sumarizePix(salesWithoutDenied);
    this.sumarizeVoucher(salesWithoutDenied);
  }

  sumarizeTotal(sales: SalesDetail[]) {
    this.totalAmount = sales.sumBy((s) => s.saleAmount) || 0;
    this.totalCount = sales.length;
  }

  sumarizeDebit(sales: SalesDetail[]) {
    const debits = sales.filter((c) => c.isDebit);

    if (!!debits && debits.some((x) => x.debitCount > 0)) {
      const amount = debits.sumBy((d) => d.debitAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = debits.sumBy((d) => d.debitCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = debits.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Débito',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizePrepaidDebit(sales: SalesDetail[]) {
    const prepaidDebits = sales.filter((c) => c.isPrepaidDebit);

    if (!!prepaidDebits && prepaidDebits.some((x) => x.prepaidDebitCount > 0)) {
      const amount = prepaidDebits.sumBy((d) => d.prepaidDebitAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = prepaidDebits.sumBy((d) => d.prepaidDebitCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = prepaidDebits.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Débito Pré-Pago',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizeCredit(sales: SalesDetail[]) {
    const credits = sales.filter((c) => c.isCredit);

    if (!!credits && credits.some((x) => x.creditCount > 0)) {
      const amount = credits.sumBy((d) => d.creditAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = credits.sumBy((d) => d.creditCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = credits.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Crédito à Vista',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizePrepaidCredit(sales: SalesDetail[]) {
    const prepaidCredits = sales.filter((c) => c.isPrepaidCredit);

    if (
      !!prepaidCredits &&
      prepaidCredits.some((x) => x.prepaidCreditCount > 0)
    ) {
      const amount = prepaidCredits.sumBy((d) => d.prepaidCreditAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = prepaidCredits.sumBy((d) => d.prepaidCreditCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = prepaidCredits.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Crédito Pré-Pago',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizeInternationalCredit(sales: SalesDetail[]) {
    const internationalCredits = sales.filter((c) => c.isInternationalCredit);

    if (
      !!internationalCredits &&
      internationalCredits.some((x) => x.internationalCreditCount > 0)
    ) {
      const amount = internationalCredits.sumBy(
        (d) => d.internationalCreditAmount,
      );
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = internationalCredits.sumBy(
        (d) => d.internationalCreditCount,
      );
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = internationalCredits.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Crédito Internacional',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizeVoucher(sales: SalesDetail[]) {
    const vouchers = sales.filter((c) => c.isVoucher);

    if (!!vouchers && vouchers.some((x) => x.voucherCount > 0)) {
      const amount = vouchers.sumBy((d) => d.voucherAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = vouchers.sumBy((d) => d.voucherCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = vouchers.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Voucher',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizeInstallments(sales: SalesDetail[]) {
    const installments = sales.filter((c) => c.isInstallments);

    if (!!installments && installments.some((x) => x.installmentsCount > 0)) {
      const amount = installments.sumBy((d) => d.installmentsAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = installments.sumBy((d) => d.installmentsCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = installments.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Parcelado 2 a 12x',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  sumarizePix(sales: SalesDetail[]) {
    const pixes = sales.filter((c) => c.isPix);

    if (!!pixes && pixes.some((x) => x.pixCount > 0)) {
      const amount = pixes.sumBy((d) => d.pixAmount);
      const amountPercent = ((amount * 100) / this.totalAmount).toFixedString(
        2,
      );

      const count = pixes.sumBy((d) => d.pixCount);
      const countPercent = ((count * 100) / this.totalCount).toFixedString(2);

      var paymentType = pixes.shift();

      this.summarySales.push({
        label: paymentType?.paymentType ?? 'Pix',
        count,
        countPercent,
        amount,
        amountPercent,
      });
    }
  }

  onExport() {
    this.export.emit();
  }

  filteringSales() {
    if (
      isEmpty(this.filterCardBrandsOptions) &&
      isEmpty(this.filterPaymentTypesOptions) &&
      isEmpty(this.filterStatusOptions) &&
      !this.filterNsu &&
      !this.filterSaleTime
    ) {
      this.filteredItems = [...this.filterSales];
      this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      return;
    }

    let filteringSales: SalesDetail[] = [];

    /// Filtrar itens primeiro
    if (!isEmpty(this.filterCardBrandsOptions)) {
      this.filterSales
        .filter((x) =>
          this.filterCardBrandsOptions
            .map((p) => p.label)
            .includes(x.cardBrand),
        )
        .forEach((x) => filteringSales.push(x));
    }

    if (!isEmpty(this.filterPaymentTypesOptions)) {
      this.filterSales
        .filter((x) =>
          this.filterPaymentTypesOptions
            .map((p) => p.label)
            .includes(x.paymentType),
        )
        .forEach((x) => filteringSales.push(x));
    }

    if (!isEmpty(this.filterStatusOptions)) {
      this.filterSales
        .filter((x) =>
          this.filterStatusOptions.map((p) => p.label).includes(x.status),
        )
        .forEach((x) => filteringSales.push(x));
    }

    if (!!this.filterNsu) {
      this.filterSales
        .filter((x) => x.nsu == this.filterNsu)
        .forEach((x) => filteringSales.push(x));
    }

    if (!!this.filterSaleTime) {
      this.filterSales
        .filter(
          (x) => moment(x.saleDate).format('HH:mm') == this.filterSaleTime,
        )
        .forEach((x) => filteringSales.push(x));
    }

    let filteredItems = filteringSales.filter(
      (thing, i, arr) => arr.findIndex((t) => t.nsu === thing.nsu) === i,
    );

    /// Filtar itens filtrados
    if (!isEmpty(this.filterCardBrandsOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterCardBrandsOptions.map((p) => p.label).includes(x.cardBrand),
      );
    }

    if (!isEmpty(this.filterPaymentTypesOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterPaymentTypesOptions
          .map((p) => p.label)
          .includes(x.paymentType),
      );
    }

    if (!isEmpty(this.filterStatusOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterStatusOptions.map((p) => p.label).includes(x.status),
      );
    }

    if (!!this.filterNsu) {
      filteredItems = filteredItems.filter((x) => x.nsu == this.filterNsu);
    }

    if (!!this.filterSaleTime) {
      filteredItems = filteredItems.filter(
        (x) => moment(x.saleDate).format('HH:mm') == this.filterSaleTime,
      );
    }

    this.filteredItems = [...filteredItems];
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  onCardBrandsChange(event: SelectOption[]) {
    this.filterCardBrandsOptions = [];
    if (!!event && event.length > 0) {
      this.filterCardBrandsOptions = event;
    }

    this.filteringSales();
  }

  onPaymentTypesChange(event: SelectOption[]) {
    this.filterPaymentTypesOptions = [];
    if (!!event && event.length > 0) {
      this.filterPaymentTypesOptions = event;
    }

    this.filteringSales();
  }

  onStatusChange(event: SelectOption[]) {
    this.filterStatusOptions = [];
    if (!!event && event.length > 0) {
      this.filterStatusOptions = event;
    }

    this.filteringSales();
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
}
