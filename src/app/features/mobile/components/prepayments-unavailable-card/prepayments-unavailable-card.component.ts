import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prepayments-unavailable-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './prepayments-unavailable-card.component.html',
  styleUrls: ['./prepayments-unavailable-card.component.scss'],
})
export class PrepaymentsUnAvailableCardComponent {
  get showAvailableMessage() {
    const now = new Date();

    return now.getHours() <= 9 || now.getHours() >= 16;
  }
}
