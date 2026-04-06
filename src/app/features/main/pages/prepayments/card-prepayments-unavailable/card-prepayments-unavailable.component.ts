import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-card-prepayments-unavailable',
  templateUrl: './card-prepayments-unavailable.component.html',
  styleUrls: ['./card-prepayments-unavailable.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class CardPrepaymentsUnAvailableComponent {

}
