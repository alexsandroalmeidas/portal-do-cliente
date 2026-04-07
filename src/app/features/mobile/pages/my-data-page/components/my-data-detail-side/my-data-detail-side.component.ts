import { Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { EconomicGroupBankingAccountResponse } from 'src/app/root-store/administration-store/administration.models';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../../../../components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelHeaderDirective } from '../../../../components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../../../../components/sidenav-panel/sidenav-panel.component';


@Component({
  selector: 'app-card-my-data-detail-side',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelHeaderDirective
  ],
  templateUrl: './my-data-detail-side.component.html',
  styleUrls: ['./my-data-detail-side.component.scss']
})

export class MyDataDetailSideComponent implements OnDestroy {
  private $unsub = new Subject();

  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Input() bankingAccount!: EconomicGroupBankingAccountResponse;
  @Output() close = new EventEmitter<void>();

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.close.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visibilityOn']) {
      this.visibilityOn = !!changes['visibilityOn'].currentValue;
    }

    if (changes['bankingAccount']) {
      // this.cardBrandsFiltered =
      //   this.economicGroupRates.rates
      //     .filter(x => x.cardBrand.toLocaleLowerCase() === this.cardBrandName.toLocaleLowerCase());

      // if (this.cardBrandName.toLocaleLowerCase() === 'pix') {
      //   this.rates.push({ paymentType: 'pix', description: 'Pix' } as PaymentTypeRate);
      // } else {
      //   this.rates = this.paymentTypeRates;
      // }
    }
  }

}
