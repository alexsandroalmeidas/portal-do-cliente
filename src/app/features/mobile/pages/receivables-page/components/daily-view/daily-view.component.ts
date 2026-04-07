import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ReceivableDetail } from '../../../../../../root-store/receivables-store/receivables.models';
import { OptionsFlags } from '../../../../../../shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';

@Component({
  selector: 'app-daily-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './daily-view.component.html',
  styleUrls: ['./daily-view.component.scss']
})
export class DailyViewComponent implements OnChanges, OnDestroy {
  private $unsub = new Subject();

  @Input() receivables: OptionsFlags<ReceivableDetail>[] = [];
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() detail = new EventEmitter<ReceivableDetail>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivables']) {
      this.receivables = [...changes['receivables'].currentValue];
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onDetailReceivable(receivable: ReceivableDetail) {
    this.detail.next(receivable);
  }

}
