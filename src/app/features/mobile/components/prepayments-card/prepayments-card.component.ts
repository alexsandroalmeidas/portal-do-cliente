import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrepaymentsUnAvailableCardComponent } from '../prepayments-unavailable-card/prepayments-unavailable-card.component';
import { HomeLoaderComponent } from '../home-loader/home-loader.component';

@Component({
  selector: 'app-prepayments-card',
  standalone: true,
  imports: [
    SharedModule,
    PrepaymentsUnAvailableCardComponent,
    HomeLoaderComponent
  ],
  templateUrl: './prepayments-card.component.html',
  styleUrls: ['./prepayments-card.component.scss']
})
export class PrepaymentsCardComponent implements OnChanges {

  @Input() showRedirect: boolean = false;
  @Input() visibilityOn: boolean = false;
  @Input() available: boolean = true;
  @Input() showTitle: boolean = true;
  @Input() useLoader: boolean = true;
  @Input() totalAmount = 0;
  @Output() filter = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visibilityOn']) {
      this.visibilityOn = !!changes['visibilityOn'].currentValue;
    }

    if (changes['totalAmount']) {
      this.totalAmount = changes['totalAmount'].currentValue;
    }
  }
}
