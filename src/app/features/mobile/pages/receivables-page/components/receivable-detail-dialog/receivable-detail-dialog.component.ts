import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { ReceivableDetail } from '../../../../../../root-store/receivables-store/receivables.models';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../../../../components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelFooterDirective } from '../../../../components/sidenav-panel/sidenav-panel-footer.directive';
import { SidenavPanelHeaderDirective } from '../../../../components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../../../../components/sidenav-panel/sidenav-panel.component';

@Component({
  selector: 'app-receivable-detail-dialog',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelFooterDirective,
    SidenavPanelHeaderDirective
  ],
  templateUrl: './receivable-detail-dialog.component.html',
  styleUrls: ['./receivable-detail-dialog.component.scss']
})

export class ReceivableDetailDialogComponent implements OnDestroy {
  private $unsub = new Subject();

  @Input() receivable!: ReceivableDetail;
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() close = new EventEmitter<void>();

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.close.next();
  }
}
