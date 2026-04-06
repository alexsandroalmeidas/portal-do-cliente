import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { takeUntil } from 'rxjs';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors
} from 'src/app/root-store/administration-store';
import {
  EconomicGroupRateResponse,
  EconomicGroupRatesResponse
} from 'src/app/root-store/administration-store/administration.models';
import { SelectOption } from 'src/app/shared/models/select-options';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AppState } from '../../../../root-store/state';
import { SharedModule } from '../../../../shared/shared.module';
import { SelectEstablishmentsComponent } from '../../components/select-establishments/select-establishments.component';
import { BasePage } from '../base.page';

@Component({
  templateUrl: './rates-fees-page.component.html',
  styleUrls: ['./rates-fees-page.component.scss'],
  standalone: true,
  imports: [SharedModule, SelectEstablishmentsComponent],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class RatesFeesPageComponent extends BasePage implements OnInit, OnDestroy, AfterViewInit {
  establishmentsSelected: string = null as any;
  establishmentsToSelect: SelectOption[] = [];
  economicGroupRates!: EconomicGroupRatesResponse;
  expandedElement!: EconomicGroupRatesResponse | null;
  rates: EconomicGroupRateResponse[] = [];
  prepaymentRate: number = 0;
  hasPrepayment = false;
  lastUpdateDate!: Date;
  reserve: number = 0;

  columnsToDisplay = [
    'cardBrand',
    'prepaidDebit',
    'cashCredit',
    'prepaidCredit',
    'installmentCredit'
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  rateNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    public dialog: MatDialog
  ) {
    super(store$, navigationService);

    this.subscribeEstablishmentsToSelect();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.verifyEstablishmentSelected();
    this.subscribeEconomicGroupRates();
    this.selectGetEconomicGroupRates();
  }

  private subscribeEstablishmentsToSelect() {
    this.store$
      .select(AdministrationStoreSelectors.selectSelectedEstablishments)
      .pipe(takeUntil(this.$unsub))
      .subscribe((establishments) => {
        if (!!establishments) {
          this.establishmentsToSelect = [
            ...establishments.map(
              (establishment) =>
                new SelectOption(
                  `${establishment.documentNumber} - ${establishment.companyName}`,
                  establishment.uid
                )
            )
          ];
        }
      });
  }

  private subscribeEconomicGroupRates() {
    this.store$
      .select(AdministrationStoreSelectors.selectEconomicGroupRates)
      .pipe(takeUntil(this.$unsub))
      .subscribe((economicGroupRates: EconomicGroupRatesResponse) => {
        this.economicGroupRates = economicGroupRates;

        if (!!this.economicGroupRates) {
          this.lastUpdateDate = this.economicGroupRates.lastUpdateDate;
          this.reserve = this.economicGroupRates.reserve;
          this.rates = this.economicGroupRates.rates;
          this.prepaymentRate = this.economicGroupRates.prepaymentRate;
          this.hasPrepayment = this.economicGroupRates.hasPrepayment;
        }
      });
  }

  private selectGetEconomicGroupRates() {
    if (!!this.establishmentsSelected) {
      this.store$.dispatch(
        new AdministrationStoreActions.GetEconomicGroupRatesAction({
          uid: this.establishmentsSelected
        })
      );
    }
  }

  onSelectedEstablishmentsClick(event: any) {
    this.establishmentsSelected = event;

    this.selectGetEconomicGroupRates();
  }

  isVisa(cardBrand: string) {
    return cardBrand.toLocaleLowerCase() === 'visa';
  }

  isMaster(cardBrand: string) {
    return (
      cardBrand.toLocaleLowerCase() === 'master' || cardBrand.toLocaleLowerCase() === 'mastercard'
    );
  }

  isElo(cardBrand: string) {
    return (
      cardBrand.toLocaleLowerCase() === 'elo' || cardBrand.toLocaleLowerCase() === 'mastercard'
    );
  }

  isAmex(cardBrand: string) {
    return (
      cardBrand.toLocaleLowerCase() === 'amex' ||
      cardBrand.toLocaleLowerCase() === 'american express'
    );
  }

  isHiper(cardBrand: string) {
    return (
      cardBrand.toLocaleLowerCase() === 'hiper' || cardBrand.toLocaleLowerCase() === 'hipercard'
    );
  }

  getSumRate(
    cardBrand: string,
    rate: any,
    period: any = null,
    prepaidRate: any = null,
    calculate: boolean = false,
    isCashCredit: boolean = false
  ) {
    if (!isCashCredit && (this.isAmex(cardBrand) || this.isHiper(cardBrand))) {
      return '...';
    }

    if (calculate && !!period && !!prepaidRate) {
      if (period === 1) {
        return `${rate.toFixed(2)} % + ${prepaidRate.toFixed(2)} %`;
      }
    }

    return ``;
  }

  getRate(
    cardBrand: string,
    rate: any,
    period: any = null,
    prepaidRate: any = null,
    calculate: boolean = false,
    isCashCredit: boolean = false
  ) {
    if (!isCashCredit && (this.isAmex(cardBrand) || this.isHiper(cardBrand))) {
      return '...';
    }

    if (calculate && !!period && !!prepaidRate) {
      if (period === 1) {
        return `${(prepaidRate + rate).toFixed(2)} %`;
      }
    }

    return `${rate.toFixed(2)} %`;
  }

  getPeriodDay(cardBrand: string, period: any, isCashCredit: boolean = false) {
    if (!isCashCredit && (this.isAmex(cardBrand) || this.isHiper(cardBrand))) {
      return '...';
    }

    if (period === 1) {
      return '1 dia';
    }

    return `${period} dias`;
  }

  getDescriptionDay(
    cardBrand: string,
    period: any = null,
    prepaidRate: any = null,
    isCashCredit: boolean = false
  ) {
    if (!isCashCredit && (this.isAmex(cardBrand) || this.isHiper(cardBrand))) {
      return '...';
    }

    return `${!!period && period === 1 && !!prepaidRate ? '(MDR + Antecipação)' : ''}`;
  }

  protected override onChangeSelectedEstablishments(): void {
    this.verifyEstablishmentSelected();

    this.selectGetEconomicGroupRates();
  }

  private verifyEstablishmentSelected() {
    if (!this.establishmentsSelected) {
      this.establishmentsSelected = this.selectedEstablishmentsUids.firstOrDefault((x) => !!x);
    } else {
      if (
        !isEmpty(this.selectedEstablishmentsUids) &&
        this.selectedEstablishmentsUids.length === 1
      ) {
        const firstEstablishment: string = this.selectedEstablishmentsUids.firstOrDefault(
          (x) => !!x
        );

        if (firstEstablishment !== this.establishmentsSelected) {
          this.establishmentsSelected = firstEstablishment;
        }
      }
    }
  }

  getIconName(cardBrand: string) {
    switch (cardBrand) {
      case 'Visa':
        return 'visa';
      case 'Mastercard':
        return 'master';
      case 'Hipercard':
        return 'hiper';
      case 'American Express':
        return 'amex';
      case 'Elo':
        return 'elo';
      case 'Pix':
        return 'pix';
    }

    return '';
  }

  getRatesCardBrand(cardBrand: string) {
    let rates: any = [];

    const ret = this.rates.filter((x) => x.cardBrand === cardBrand);

    if (!!ret) {
      rates.push({ installment: 2, rateValue: ret[0].installment02 });
      rates.push({ installment: 3, rateValue: ret[0].installment03 });
      rates.push({ installment: 4, rateValue: ret[0].installment04 });
      rates.push({ installment: 5, rateValue: ret[0].installment05 });
      rates.push({ installment: 6, rateValue: ret[0].installment06 });
      rates.push({ installment: 7, rateValue: ret[0].installment07 });
      rates.push({ installment: 8, rateValue: ret[0].installment08 });
      rates.push({ installment: 9, rateValue: ret[0].installment09 });
      rates.push({ installment: 10, rateValue: ret[0].installment10 });
      rates.push({ installment: 11, rateValue: ret[0].installment11 });
      rates.push({ installment: 12, rateValue: ret[0].installment12 });
    }

    return rates;
  }
}
