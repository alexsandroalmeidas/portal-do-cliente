import { Establishment } from '@/root-store/administration-store/administration.models';
import { ReceivablesStoreSelectors } from '@/root-store/receivables-store';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { AdministrationStoreSelectors } from './../../../../../root-store/administration-store';
import {
  BankingAccount,
  ReceivableDetail
} from './../../../../../root-store/receivables-store/receivables.models';
import { AppState } from './../../../../../root-store/state';
import {
  SortableHeaderDirective,
  SortEvent,
  TableService
} from './../../../../../shared/components/table';
import { SelectOption } from './../../../../../shared/models/select-options';
import { TablePagination } from './../../../../../shared/models/table.model';
import { SharedModule } from './../../../../../shared/shared.module';
import { BankingAccountsCarouselComponent } from './banking-accounts-carousel/banking-accounts-carousel';

@Component({
  selector: 'app-detail-vision',
  templateUrl: './detail-vision.component.html',
  styleUrls: ['./detail-vision.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  standalone: true,
  imports: [BankingAccountsCarouselComponent, SharedModule, TooltipComponent]
})
export class DetailVisionComponent implements OnInit, OnDestroy, OnChanges {
  private $unsub = new Subject();

  @Input() filterReceivables: ReceivableDetail[] = [];
  @Output() export = new EventEmitter();
  columnsToDisplay = [
    'saleDate',
    'saleAmount',
    'discountFee',
    'paymentAmount',
    'cardBrand',
    'paymentType',
    'nsu',
    'paymentStatus'
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: ReceivableDetail | null;

  dataSource: ReceivableDetail[] = [];
  filteredItems: ReceivableDetail[] = [];

  bankingAccounts: BankingAccount[] = [];

  cardBrandsOptions: SelectOption[] = [];
  filterCardBrandsOptions: SelectOption[] = [];

  paymentTypesOptions: SelectOption[] = [];
  filterPaymentTypesOptions: SelectOption[] = [];

  statusOptions: SelectOption[] = [];
  filterStatusOptions: SelectOption[] = [];

  releaseTypesOptions: SelectOption[] = [];
  filterReleaseTypesOptions: SelectOption[] = [];

  totalAmount: number = 0;

  pixAmount: number = 0;
  pixPercent: string = '0';
  creditCardAmount: number = 0;
  creditCardPercent: string = '0';

  activeSlideIndex = 0;
  tablePage = 1;
  itemsPerPage = 10;
  maxSize = 5;

  page?: number;

  totalItems: number = 0;
  itemsPerSlide = 2;
  singleSlideOffset = false;
  noWrapSlides = true;
  showIndicators = false;

  more1Year = new Date().date().addDays(365);
  less1Year = new Date().date().addDays(-365);

  selectedEstablishment!: string;
  lastUpdateDate!: Date;

  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  constructor(
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.pixAmount = 0;
    this.creditCardAmount = 0;
    this.totalAmount = 0;

    this.subscribeSelectedEstablishments();
    this.subscribeLastUpdateDateReceivable();
  }

  private subscribeLastUpdateDateReceivable() {
    this.store$
      .select(ReceivablesStoreSelectors.selectLastUpdateDateReceivables)
      .pipe(takeUntil(this.$unsub))
      .subscribe((last) => {
        if (!!last) this.lastUpdateDate = last.lastUpdateDate;
      });
  }

  private subscribeSelectedEstablishments() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        const firstSeletecEstablishment = establishments.firstOrDefault(
          (x) => !!x
        ) as Establishment;
        this.selectedEstablishment = firstSeletecEstablishment.companyName;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['filterReceivables']) {
      let filterReceivables = Array.from<ReceivableDetail>(
        changes['filterReceivables']?.currentValue ?? []
      )?.sortBy((x) => x.sortingDate);

      filterReceivables = filterReceivables?.sortBy((x) => x.paymentDate).reverse();

      this.sumarizeAmounts(filterReceivables);

      this.loadBankingAccounts(filterReceivables.filter((x) => x.paymentStatus !== 'Em Aberto'));

      if (!isEmpty(filterReceivables)) {
        const cardBrands = [
          ...new Set(
            filterReceivables.map((item) => new SelectOption(item.cardBrand, item.cardBrand))
          )
        ];

        this.cardBrandsOptions = cardBrands.filter(
          (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i
        );

        const paymentTypes = [
          ...new Set(
            filterReceivables.map((item) => new SelectOption(item.paymentType, item.paymentType))
          )
        ];

        this.paymentTypesOptions = paymentTypes.filter(
          (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i
        );

        const paymentStatus = [
          ...new Set(
            filterReceivables.map(
              (item) => new SelectOption(item.paymentStatus, item.paymentStatus)
            )
          )
        ];

        this.statusOptions = paymentStatus.filter(
          (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i
        );

        const releaseTypes = [
          ...new Set(
            filterReceivables.map(
              (item) => new SelectOption(item.releaseTypeDescription, item.releaseTypeDescription)
            )
          )
        ];

        this.releaseTypesOptions = releaseTypes.filter(
          (thing, i, arr) => arr.findIndex((t) => t.label === thing.label) === i
        );
      }

      this.filteredItems = [...filterReceivables];

      this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
    }

    this.cdr.detectChanges();
  }

  sumarizeAmounts(items: ReceivableDetail[]) {
    this.totalAmount = items?.sumBy((s) => s.paymentAmount) || 0;

    const pix = items?.filter((p) => p.isPix);
    this.pixAmount = pix?.sumBy((s) => s.paymentAmount) || 0;
    this.pixPercent = ((this.pixAmount * 100) / this.totalAmount).toFixedString(2);

    const otherTransactions = items?.filter((p) => !p.isPix);
    this.creditCardAmount = otherTransactions?.sumBy((s) => s.paymentAmount) || 0;
    this.creditCardPercent = ((this.creditCardAmount * 100) / this.totalAmount).toFixedString(2);
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onExport() {
    this.export.emit();
  }

  loadBankingAccounts(receivables: ReceivableDetail[]) {
    this.bankingAccounts = [];

    if (!isEmpty(receivables)) {
      const group = receivables
        .filter((x) => !x.isAdjust && x.bank > 0)
        .groupBy((x) => `${x.originPix}${x.bank}${x.account}`);

      const keys = Object.keys(group);

      this.bankingAccounts = keys.map((key) => {
        const paymentValue = group[key]?.sumBy((s) => s.paymentAmount) || 0;

        const adjustmentsCreditAmmount = group[key][0].isPix
          ? 0
          : receivables
              .filter(
                (x) =>
                  x.isAdjust &&
                  x.sortingDate === group[key][0].sortingDate &&
                  x.releaseTypeDescription.includes('Ajuste a Crédito')
              )
              .sumBy((d) => d.releaseValue);

        const adjustmentsDebitAmmount = group[key][0].isPix
          ? 0
          : receivables
              .filter(
                (x) =>
                  x.isAdjust &&
                  x.sortingDate === group[key][0].sortingDate &&
                  x.releaseTypeDescription.includes('Ajuste a Débito')
              )
              .sumBy((d) => d.releaseValue);

        // adjustmentsDebitAmmount está vindo negativo
        let amount = paymentValue + adjustmentsCreditAmmount + adjustmentsDebitAmmount;

        const bankAccount = {
          amount,
          account: group[key][0].account,
          agency: group[key][0].agency,
          bank: group[key][0].bank,
          isPix: group[key][0].isPix,
          originPix: group[key][0].originPix
        };

        return bankAccount as BankingAccount;
      });
    }

    this.cdr.detectChanges();
  }

  filteringReceivables() {
    if (
      isEmpty(this.filterCardBrandsOptions) &&
      isEmpty(this.filterPaymentTypesOptions) &&
      isEmpty(this.filterStatusOptions) &&
      isEmpty(this.filterReleaseTypesOptions)
    ) {
      this.filteredItems = [...this.filterReceivables];
      this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
      return;
    }

    let filteringReceivables: ReceivableDetail[] = [];

    /// Filtrar itens primeiro
    if (!isEmpty(this.filterCardBrandsOptions)) {
      this.filterReceivables
        .filter((x) => this.filterCardBrandsOptions.map((p) => p.label).includes(x.cardBrand))
        .forEach((x) => filteringReceivables.push(x));
    }

    if (!isEmpty(this.filterPaymentTypesOptions)) {
      this.filterReceivables
        .filter((x) => this.filterPaymentTypesOptions.map((p) => p.label).includes(x.paymentType))
        .forEach((x) => filteringReceivables.push(x));
    }

    if (!isEmpty(this.filterStatusOptions)) {
      this.filterReceivables
        .filter((x) => this.filterStatusOptions.map((p) => p.label).includes(x.paymentStatus))
        .forEach((x) => filteringReceivables.push(x));
    }

    if (!isEmpty(this.filterReleaseTypesOptions)) {
      this.filterReceivables
        .filter((x) =>
          this.filterReleaseTypesOptions.map((p) => p.label).includes(x.releaseTypeDescription)
        )
        .forEach((x) => filteringReceivables.push(x));
    }

    let filteredItems = filteringReceivables.filter(
      (thing, i, arr) => arr.findIndex((t) => t.nsu === thing.nsu) === i
    );

    /// Filtar itens filtrados
    if (!isEmpty(this.filterCardBrandsOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterCardBrandsOptions.map((p) => p.label).includes(x.cardBrand)
      );
    }

    if (!isEmpty(this.filterPaymentTypesOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterPaymentTypesOptions.map((p) => p.label).includes(x.paymentType)
      );
    }

    if (!isEmpty(this.filterStatusOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterStatusOptions.map((p) => p.label).includes(x.paymentStatus)
      );
    }

    if (!isEmpty(this.filterReleaseTypesOptions)) {
      filteredItems = filteredItems.filter((x) =>
        this.filterReleaseTypesOptions.map((p) => p.label).includes(x.releaseTypeDescription)
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

    this.filteringReceivables();
  }

  onPaymentTypesChange(event: SelectOption[]) {
    this.filterPaymentTypesOptions = [];
    if (!!event && event.length > 0) {
      this.filterPaymentTypesOptions = event;
    }

    this.filteringReceivables();
  }

  onStatusChange(event: SelectOption[]) {
    this.filterStatusOptions = [];
    if (!!event && event.length > 0) {
      this.filterStatusOptions = event;
    }

    this.filteringReceivables();
  }

  onReleaseTypeChange(event: SelectOption[]) {
    this.filterReleaseTypesOptions = [];
    if (!!event && event.length > 0) {
      this.filterReleaseTypesOptions = event;
    }

    this.filteringReceivables();
  }

  onPaginate(tablePagination: TablePagination): void {
    this.tablePage = tablePagination.page;
    this.dataSource = this.tableService.paginate(tablePagination, this.filteredItems);
  }

  onSort({ column, direction }: SortEvent) {
    this.filteredItems = this.tableService.sort(
      { column, direction },
      this.headers,
      this.filteredItems
    );
    this.onPaginate({ page: 1, itemsPerPage: this.itemsPerPage });
  }
}
