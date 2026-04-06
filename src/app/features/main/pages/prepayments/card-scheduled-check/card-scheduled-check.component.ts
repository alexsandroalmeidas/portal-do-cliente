import { Component, Input } from '@angular/core';
import { BankingAccount, getAccreditationName } from 'src/app/root-store/prepayments-store/prepayments.models';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-card-scheduled-check',
  templateUrl: './card-scheduled-check.component.html',
  styleUrls: ['./card-scheduled-check.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class CardScheduledCheckComponent {

  @Input() visibilityOn: boolean = true;
  @Input() bankingAccount: OptionsFlags<BankingAccount> = null as any;
  @Input() rate!: OptionsFlags<number>;
  @Input() scheduledMode!: string;
  @Input() selection: OptionsFlags<string> = null as any;
  @Input() selectedAccreditations: OptionsFlags<string[]> = null as any;

  get getScheduledMode() {

    let scheduleModeReturn = 'Diariamente';

    if (!!this.scheduledMode) {
      scheduleModeReturn = (this.scheduledMode === 'monthly-accreditations' || this.scheduledMode === 'monthly-check')
        ? 'Mensalmente'
        : (this.scheduledMode === 'weekly-accreditations' || this.scheduledMode === 'weekly-check')
          ? 'Semanalmente'
          : 'Diariamente';
    }

    return scheduleModeReturn;
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }
}
