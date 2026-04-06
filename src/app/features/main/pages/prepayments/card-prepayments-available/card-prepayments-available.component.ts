import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardPrepaymentsUnAvailableComponent } from '../card-prepayments-unavailable/card-prepayments-unavailable.component';

@Component({
  selector: 'app-card-prepayments-available',
  templateUrl: './card-prepayments-available.component.html',
  styleUrls: ['./card-prepayments-available.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CardPrepaymentsUnAvailableComponent
  ],
})
export class CardPrepaymentsAvailableComponent {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  @Input() prepaymentsAvailable = false;
  @Input() totalAvailableAmountPrepayment = 0;

}
