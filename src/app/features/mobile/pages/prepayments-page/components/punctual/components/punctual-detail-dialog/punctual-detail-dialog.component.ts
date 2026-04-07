import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavPanelBodyDirective } from 'src/app/features/mobile/components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelFooterDirective } from 'src/app/features/mobile/components/sidenav-panel/sidenav-panel-footer.directive';
import { SidenavPanelHeaderDirective } from 'src/app/features/mobile/components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from 'src/app/features/mobile/components/sidenav-panel/sidenav-panel.component';
import { PunctualDetail, BankingAccount } from 'src/app/root-store/prepayments-store/prepayments.models';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-punctual-detail-dialog',
  templateUrl: './punctual-detail-dialog.component.html',
  styleUrls: ['./punctual-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelFooterDirective,
    SidenavPanelHeaderDirective
  ]
})
export class PunctualDetailDialogComponent implements OnChanges, OnDestroy {
  private $unsub = new Subject();

  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Input() punctualDetail: PunctualDetail = {} as PunctualDetail;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['punctualDetail']) {
      this.punctualDetail = {
        ...changes['punctualDetail'].currentValue
      };
    }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.close.next();
  }
}