import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isEmpty } from 'lodash';
import { GetScheduledFinalizedResponse, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-card-prepayments-scheduled-conditions',
  templateUrl: './card-prepayments-scheduled-conditions.component.html',
  styleUrls: ['./card-prepayments-scheduled-conditions.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class CardPrepaymentsScheduledConditionsComponent {

  @Input() prepaymentEstablishmentsSelected: string = null as any;
  @Input() scheduledFinalized: GetScheduledFinalizedResponse = { id: null as any } as GetScheduledFinalizedResponse;
  
  @Output() cancelClick = new EventEmitter();
  @Output() editClick = new EventEmitter();


  get period() {

    if (!isEmpty(this.scheduledFinalized)) {
      if (!isEmpty(this.scheduledFinalized.daysOfWeek)) {
        const dayName = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");

        if (this.scheduledFinalized.daysOfWeek.length === 1) {
          return dayName[this.scheduledFinalized.daysOfWeek[0]];
        } else {

          const listOrdered = this.scheduledFinalized.daysOfWeek.sortBy(x => x);
          return `${dayName[listOrdered[0]]} - ${dayName[listOrdered[1]]}`;
        }
      }

      if (!isEmpty(this.scheduledFinalized.daysOfMonth)) {

        if (this.scheduledFinalized.daysOfMonth.length === 1) {
          return this.scheduledFinalized.daysOfMonth[0];
        } else {
          const listOrdered = this.scheduledFinalized.daysOfMonth.sortBy(x => x);

          return `${listOrdered[0]} e ${listOrdered[1]}`;
        }
      }

    }

    return '';
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
