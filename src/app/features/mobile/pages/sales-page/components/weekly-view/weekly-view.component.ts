import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { SalesCalendar, SalesWeeklySummary } from '../../../../../../root-store/sales-store/sales.models';
import { OptionsFlags } from '../../../../../../shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';

@Component({
  selector: 'app-sales-weekly-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './weekly-view.component.html',
  styleUrls: ['./weekly-view.component.scss']
})
export class WeeklyViewComponent implements OnChanges, OnDestroy {
  private $unsub = new Subject();

  @Input() sales: OptionsFlags<SalesCalendar>[] = [];
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() salesEmitter = new EventEmitter();

  weeklySales: SalesWeeklySummary[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sales']) {
      this.sales = [...changes['sales'].currentValue];
      this.evaluateWeeklySales();
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  private evaluateWeeklySales() {
    const filteredSalesCalendar: SalesCalendar[] = this.sales;


    const group = filteredSalesCalendar
      ?.filter(s => s.paymentStatus !== 'Negada' && s.paymentStatus !== 'Desfeita')
      .map(p => {
        return {
          ...p,
          groupKey: p.yearMonthDay
        };
      })
      .groupBy((p: any) => p.groupKey);

    let totalCount = 0;
    let totalAmount = 0;

    let keys = Object.keys(group);

    this.weeklySales = keys.map((key) => {

      totalCount = 0;
      totalAmount = 0;

      group[key]
        .forEach((sale: SalesCalendar) => {
          const {
            debitCount = 0,
            creditCount = 0,
            voucherCount = 0,
            pixCount = 0,
            installmentsCount = 0,
            prepaidCreditCount = 0,
            internationalCreditCount = 0,
            prepaidDebitCount = 0,

            debitAmount = 0,
            creditAmount = 0,
            voucherAmount = 0,
            pixAmount = 0,
            installmentsAmount = 0,
            prepaidCreditAmount = 0,
            internationalCreditAmount = 0,
            prepaidDebitAmount = 0,
          } = sale;

          totalCount += debitCount + creditCount + voucherCount + pixCount + installmentsCount + prepaidCreditCount + internationalCreditCount + prepaidDebitCount;
          totalAmount += debitAmount + creditAmount + voucherAmount + pixAmount + installmentsAmount + prepaidCreditAmount + internationalCreditAmount + prepaidDebitAmount;
        });

      return {
        date: Date.fromString(key),
        totalCount,
        totalAmount
      };
    });
  }

  async goToSales(date: any) {
    this.salesEmitter.emit(date);
  }
}
