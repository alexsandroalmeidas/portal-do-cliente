import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';

import { SummaryCardReceivables } from './../../../../../root-store/receivables-store/receivables.models';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-card-my-receivables',
  templateUrl: './card-my-receivables.component.html',
  styleUrls: ['./card-my-receivables.component.scss'],
  standalone: true,
  imports: [SharedModule, TooltipComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardMyReceivablesComponent implements OnInit, OnChanges {
  $unsub = new Subject();
  @Input() receivables: SummaryCardReceivables = {} as SummaryCardReceivables;
  @Input() lastUpdateDate!: Date;

  today = new Date().date();
  more1Day = new Date().date().addDays(1);
  more1Year = new Date().date().addDays(365);

  totalAmount: number = 0;
  debitAmount: number = 0;
  debitPercent: string = '0';
  creditAmount: number = 0;
  creditPercent: string = '0';
  pixAmount: number = 0;
  pixPercent: string = '0';
  totalCount: number = 0;

  todayReceivablesAmount: number = 0;
  futureReceivablesAmount: number = 0;

  @Input() reserve: number = 0;

  ngOnInit() {
    this.totalAmount = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const receivables =
      changes['receivables']?.currentValue ??
      ({
        creditAmount: 0,
        creditCount: 0,
        creditPercent: (0).toFixedString(2),
        debitAmount: 0,
        debitCount: 0,
        debitPercent: (0).toFixedString(2),
        futureAmount: 0,
        todayAmount: 0,
        totalAmount: 0,
        totalCount: 0,
      } as SummaryCardReceivables);

    this.totalAmount = receivables.totalAmount;
    this.totalCount = receivables.totalCount;

    this.debitAmount = receivables.debitAmount;
    this.debitPercent = receivables.debitPercent;

    this.creditAmount = receivables.creditAmount;
    this.creditPercent = receivables.creditPercent;

    this.pixAmount = receivables.pixAmount;
    this.pixPercent = receivables.pixPercent;

    this.futureReceivablesAmount = receivables.futureAmount;
    this.todayReceivablesAmount = receivables.todayAmount;
  }
}
