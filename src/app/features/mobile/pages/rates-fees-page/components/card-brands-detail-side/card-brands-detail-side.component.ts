import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  EconomicGroupRateResponse,
  EconomicGroupRatesResponse,
} from 'src/app/root-store/administration-store/administration.models';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../../../../components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelHeaderDirective } from '../../../../components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../../../../components/sidenav-panel/sidenav-panel.component';

export interface PaymentTypeRate {
  paymentType: string;
  description: string;
}

@Component({
  selector: 'app-card-brands-detail-side',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelHeaderDirective,
  ],
  templateUrl: './card-brands-detail-side.component.html',
  styleUrls: ['./card-brands-detail-side.component.scss'],
})
export class CardBrandsDetailSideComponent implements OnDestroy {
  private $unsub = new Subject();

  @Input() economicGroupRates!: EconomicGroupRatesResponse;
  @Input() cardBrandSelected: string = '';
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() close = new EventEmitter<void>();
  cardBrandsFiltered!: EconomicGroupRateResponse[];
  rates: PaymentTypeRate[] = [];
  prepaymentRate: number = 0;
  hasPrepayment = false;
  paymentTypeRates = [
    {
      paymentType: 'prepaidDebit',
      description: 'Débito/Pré Pago',
    } as PaymentTypeRate,
    {
      paymentType: 'cashCredit',
      description: 'Crédito à vista',
    } as PaymentTypeRate,
    {
      paymentType: 'prepaidCredit',
      description: 'Crédito pré-pago',
    } as PaymentTypeRate,
    // { paymentType: 'installmentCredit', description: 'Crédito parcelado' } as PaymentTypeRate,
    {
      paymentType: 'installment02',
      description: 'Parcela 2',
    } as PaymentTypeRate,
    {
      paymentType: 'installment03',
      description: 'Parcela 3',
    } as PaymentTypeRate,
    {
      paymentType: 'installment04',
      description: 'Parcela 4',
    } as PaymentTypeRate,
    {
      paymentType: 'installment05',
      description: 'Parcela 5',
    } as PaymentTypeRate,
    {
      paymentType: 'installment06',
      description: 'Parcela 6',
    } as PaymentTypeRate,
    {
      paymentType: 'installment07',
      description: 'Parcela 7',
    } as PaymentTypeRate,
    {
      paymentType: 'installment08',
      description: 'Parcela 8',
    } as PaymentTypeRate,
    {
      paymentType: 'installment09',
      description: 'Parcela 9',
    } as PaymentTypeRate,
    {
      paymentType: 'installment10',
      description: 'Parcela 10',
    } as PaymentTypeRate,
    {
      paymentType: 'installment11',
      description: 'Parcela 11',
    } as PaymentTypeRate,
    {
      paymentType: 'installment12',
      description: 'Parcela 12',
    } as PaymentTypeRate,
  ];

  get cardBrandName() {
    if (!!this.cardBrandSelected) {
      switch (this.cardBrandSelected) {
        case 'visa':
          return 'Visa';
        case 'master':
          return 'MasterCard';
        case 'hiper':
          return 'HiperCard';
        case 'amex':
          return 'American Express';
        case 'elo':
          return 'Elo';
        case 'pix':
          return 'Pix';
      }
    }

    return '';
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visibilityOn']) {
      this.visibilityOn = !!changes['visibilityOn'].currentValue;
    }

    if (changes['cardBrandSelected']) {
      this.prepaymentRate = this.economicGroupRates.prepaymentRate;
      this.hasPrepayment = this.economicGroupRates.hasPrepayment;

      this.cardBrandsFiltered = this.economicGroupRates.rates.filter(
        (x) =>
          x.cardBrand.toLocaleLowerCase() ===
          this.cardBrandName.toLocaleLowerCase(),
      );

      if (this.cardBrandName.toLocaleLowerCase() === 'pix') {
        this.rates.push({
          paymentType: 'pix',
          description: 'Pix',
        } as PaymentTypeRate);
      } else {
        if (this.hasPrepayment) {
          this.paymentTypeRates.push({
            paymentType: 'prepayment',
            description: 'Antecipação',
          } as PaymentTypeRate);
        }

        this.rates = this.paymentTypeRates;
      }
    }
  }

  onClose() {
    this.close.next();
  }

  getRate(paymentTypeRate: PaymentTypeRate) {
    let rate = null;

    switch (paymentTypeRate.paymentType) {
      case 'prepaidDebit': {
        if (this.isAmex() || this.isHiper()) {
          rate = null;
        } else {
          rate =
            this.cardBrandsFiltered
              ?.map((p) => p.prepaidDebit)
              .firstOrDefault((x) => !!x) ?? 0;
        }
        break;
      }
      case 'cashCredit': {
        const cashCreditRate =
          this.cardBrandsFiltered
            ?.map((p) => p.cashCredit)
            .firstOrDefault((x) => !!x) ?? 0;
        const period =
          this.cardBrandsFiltered
            ?.map((p) => p.cashCreditPeriod)
            .firstOrDefault((x) => !!x) ?? 0;

        if (period === 1) {
          rate = (this.prepaymentRate + Number(cashCreditRate)).toFixed(2);
        } else {
          rate = cashCreditRate;
        }

        break;
      }
      case 'prepaidCredit': {
        if (this.isAmex() || this.isHiper()) {
          rate = null;
        } else {
          const prepaidCreditRate =
            this.cardBrandsFiltered
              ?.map((p) => p.prepaidCredit)
              .firstOrDefault((x) => !!x) ?? 0;
          const period =
            this.cardBrandsFiltered
              ?.map((p) => p.prepaidCreditPeriod)
              .firstOrDefault((x) => !!x) ?? 0;

          if (period === 1) {
            rate = (this.prepaymentRate + Number(prepaidCreditRate)).toFixed(2);
          } else {
            rate = prepaidCreditRate;
          }
        }
        break;
      }
      // case 'installmentCredit': {
      //   rate = this.cardBrandsFiltered?.map(p => p.cashCredit).firstOrDefault(x => !!x) ?? 0;
      //   break;
      // }
      case 'installment02': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment02)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment03': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment03)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment04': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment04)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment05': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment05)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment06': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment06)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment07': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment07)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment08': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment08)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment09': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment09)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment10': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment10)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment11': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment11)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment12': {
        rate =
          this.cardBrandsFiltered
            ?.map((p) => p.installment12)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'prepayment': {
        rate = this.prepaymentRate ?? 0;
        break;
      }
      case 'pix': {
        rate = this.economicGroupRates?.pixRate ?? 0;
        break;
      }
    }

    return rate === null ? '...' : `${rate} %`;
  }

  getPeriod(paymentTypeRate: PaymentTypeRate) {
    if (this.isPix()) {
      return this.economicGroupRates?.isEntrePay
        ? this.economicGroupRates?.liquidationtime
        : '1 dia';
    }

    let period = null;

    switch (paymentTypeRate.paymentType) {
      case 'prepaidDebit': {
        if (this.isVisa() || this.isMaster() || this.isElo()) {
          period = 1;
        } else if (this.isAmex() || this.isHiper()) {
          period = null;
        } else {
          period =
            this.cardBrandsFiltered
              .map((p) => p.prepaidDebitPeriod)
              .firstOrDefault((x) => !!x) ?? 0;
        }

        break;
      }
      case 'cashCredit': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.cashCreditPeriod)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'prepaidCredit': {
        if (this.isVisa() || this.isMaster() || this.isElo()) {
          period = 2;
        } else if (this.isAmex() || this.isHiper()) {
          period = null;
        } else {
          period =
            this.cardBrandsFiltered
              .map((p) => p.prepaidCreditPeriod)
              .firstOrDefault((x) => !!x) ?? 0;
        }

        break;
      }
      // case 'installmentCredit': {
      //   period = this.cardBrandsFiltered.map(p => p.cashCreditPeriod).firstOrDefault(x => !!x) ?? 0;
      //   break;
      // }
      case 'installment02': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment02Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment03': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment03Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment04': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment04Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment05': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment05Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment06': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment06Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment07': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment07Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment08': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment08Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment09': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment09Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment10': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment10Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment11': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment11Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
      case 'installment12': {
        period =
          this.cardBrandsFiltered
            .map((p) => p.installment12Period)
            .firstOrDefault((x) => !!x) ?? 0;
        break;
      }
    }

    return period === null ? '...' : period === 1 ? '1 dia' : `${period} dias`;
  }

  isPix() {
    return this.cardBrandName.toLocaleLowerCase() === 'pix';
  }

  isVisa() {
    return this.cardBrandName.toLocaleLowerCase() === 'visa';
  }

  isMaster() {
    return (
      this.cardBrandName.toLocaleLowerCase() === 'master' ||
      this.cardBrandName.toLocaleLowerCase() === 'mastercard'
    );
  }

  isElo() {
    return (
      this.cardBrandName.toLocaleLowerCase() === 'elo' ||
      this.cardBrandName.toLocaleLowerCase() === 'mastercard'
    );
  }

  isAmex() {
    return (
      this.cardBrandName.toLocaleLowerCase() === 'amex' ||
      this.cardBrandName.toLocaleLowerCase() === 'american express'
    );
  }

  isHiper() {
    return (
      this.cardBrandName.toLocaleLowerCase() === 'hiper' ||
      this.cardBrandName.toLocaleLowerCase() === 'hipercard'
    );
  }
}
