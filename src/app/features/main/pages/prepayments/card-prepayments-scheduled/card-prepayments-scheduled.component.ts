import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetScheduledFinalizedResponse, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckMarkedComponent } from '../../../components/check-marked/check-marked.component';

@Component({
  selector: 'app-card-prepayments-scheduled',
  templateUrl: './card-prepayments-scheduled.component.html',
  styleUrls: ['./card-prepayments-scheduled.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    CheckMarkedComponent
  ],
})
export class CardPrepaymentsScheduledComponent {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  @Input() scheduledRate = 0;
  @Input() finalized = false;
  @Input() scheduledFinalized: GetScheduledFinalizedResponse = { id: null as any } as GetScheduledFinalizedResponse;
  @Input() period: any = null as any;
  @Output() activateClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() editClick = new EventEmitter();

  onActivateClick() {
    this.activateClick.emit();
  }

  onCancelClick() {
    this.cancelClick.emit();
  }

  onEditClick() {
    this.editClick.emit();
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }
}
