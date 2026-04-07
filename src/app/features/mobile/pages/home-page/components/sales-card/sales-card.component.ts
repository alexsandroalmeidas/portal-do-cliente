import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SalesPeriodFilterOptions } from '../../../../models/period-filter';
import { SharedModule } from './../../../../../../shared/shared.module';
import { SummaryCardSales } from './../../../../../../root-store/sales-store/sales.models';

@Component({
  selector: 'app-sales-card',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './sales-card.component.html',
  styleUrls: ['./sales-card.component.scss']
})
export class SalesCardComponent implements OnChanges {

  @Input() visibilityOn: boolean = false;
  @Input() values: SummaryCardSales = {} as SummaryCardSales;

  @Output() refresh = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();

  PeriodFilterOptions = SalesPeriodFilterOptions;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visibilityOn']) {
      this.visibilityOn = !!changes['visibilityOn'].currentValue;
    }

    if (changes['values']) {
      this.values = {
        ...changes['values'].currentValue
      };
    }
  }

}
