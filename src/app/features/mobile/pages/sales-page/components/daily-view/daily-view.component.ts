import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { SalesDetail } from './../../../../../../root-store/sales-store/sales.models';
import { OptionsFlags } from './../../../../../../shared/models/options-flag';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-daily-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './daily-view.component.html',
  styleUrls: ['./daily-view.component.scss']
})
export class DailyViewComponent implements OnChanges, OnDestroy {
  private $unsub = new Subject();

  @Input() sales: OptionsFlags<SalesDetail>[] = [];
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() detail = new EventEmitter<SalesDetail>();

  getIdentification(nsu: string) {
    if (!!nsu) {
      return nsu.length > 16
        ? nsu.slice(0, 16) + '...'
        : nsu
    }

    return nsu;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sales']) {
      this.sales = [...changes['sales'].currentValue];
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onDetailSale(sale: SalesDetail) {
    this.detail.next(sale);
  }

}
