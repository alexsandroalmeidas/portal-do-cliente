import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';
import {
  ReceivableCalendar,
  ReceivableWeeklySummary,
} from '../../../../../../root-store/receivables-store/receivables.models';
import { OptionsFlags } from '../../../../../../shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';

@Component({
  selector: 'app-receivables-weekly-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './weekly-view.component.html',
  styleUrls: ['./weekly-view.component.scss'],
})
export class WeeklyViewComponent implements OnChanges, OnDestroy {
  private $unsub = new Subject();

  @Input() receivables: OptionsFlags<ReceivableCalendar>[] = [];
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() receivablesEmitter = new EventEmitter();

  weeklyReceivables: ReceivableWeeklySummary[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivables']) {
      this.receivables = [...changes['receivables'].currentValue];
      this.evaluateWeeklyReceivables();
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  private evaluateWeeklyReceivables() {
    const filteredReceivablesDetails: ReceivableCalendar[] = this.receivables;

    const group = filteredReceivablesDetails.groupBy(
      (x) => `${x.paymentDate}${x.paymentStatus}`,
    );

    let keys = Object.keys(group);

    this.weeklyReceivables = keys.map((key) => {
      let dtReceivable = moment(group[key][0].paymentDate).toDate();

      const paymentDate = new Date(
        dtReceivable.getFullYear(),
        dtReceivable.getMonth(),
        dtReceivable.getDate(),
      );

      const paymentValue = group[key]?.sumBy((s) => s.amount);

      const adjustmentsCreditAmmount = filteredReceivablesDetails
        .filter(
          (x) => x.isAdjust && x.sortingDate === group[key][0].sortingDate,
        )
        .sumBy((s) => s.adjustmentsCredits.sumBy((s) => s.amount));

      let adjustmentsDebitAmmount = filteredReceivablesDetails
        .filter(
          (x) => x.isAdjust && x.sortingDate === group[key][0].sortingDate,
        )
        .sumBy((s) => s.adjustmentsDebits.sumBy((s) => s.amount));

      // adjustmentsDebitAmmount está vindo negativo
      let amount =
        paymentValue + adjustmentsCreditAmmount + adjustmentsDebitAmmount;

      return {
        amount,
        date: paymentDate,
        isAdjust: group[key][0].isAdjust,
        status: group[key][0].paymentStatus ?? 'Em Aberto',
      };
    });
  }

  async goToReceivables(date: any) {
    this.receivablesEmitter.emit(date);
  }

  getStatusIcon(status: string) {
    if (!!status) {
      return status === 'Pago' ? 'done' : 'schedule';
    }

    return '';
  }
}
