import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetScheduledFinalizedResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardPrepaymentsUnAvailableComponent } from '../card-prepayments-unavailable/card-prepayments-unavailable.component';
import { CheckMarkedComponent } from '../../../components/check-marked/check-marked.component';

@Component({
  selector: 'app-card-prepayments-punctual',
  templateUrl: './card-prepayments-punctual.component.html',
  styleUrls: ['./card-prepayments-punctual.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CardPrepaymentsUnAvailableComponent,
    CheckMarkedComponent
  ],
})
export class CardPrepaymentsPunctualComponent {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  @Input() punctualRate = 0;
  @Input() finalized = false;
  @Input() prepaymentsAvailable = false;
  @Output() requestClick = new EventEmitter<boolean>();

  async onRequestClick() {
    this.requestClick.emit(true);
  }
}
