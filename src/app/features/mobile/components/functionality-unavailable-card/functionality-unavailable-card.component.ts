import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-functionality-unavailable-card',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './functionality-unavailable-card.component.html',
  styleUrls: ['./functionality-unavailable-card.component.scss']
})
export class FunctionalityUnavailableCardComponent{

}
