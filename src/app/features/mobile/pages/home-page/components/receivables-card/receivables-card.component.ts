import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TooltipComponent } from 'src/app/features/mobile/components/tooltip/tooltip.component';
import { SummaryCardReceivables } from './../../../../../../root-store/receivables-store/receivables.models';
import { SharedModule } from './../../../../../../shared/shared.module';

@Component({
  selector: 'app-receivables-card',
  standalone: true,
  imports: [SharedModule, TooltipComponent],
  templateUrl: './receivables-card.component.html',
  styleUrls: ['./receivables-card.component.scss']
})
export class ReceivablesCardComponent implements OnChanges {
  @Input() visibilityOn: boolean = false;
  @Input() values: SummaryCardReceivables = {} as SummaryCardReceivables;
  @Input() lastUpdateDate!: Date;
  @Output() filter = new EventEmitter<void>();

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
