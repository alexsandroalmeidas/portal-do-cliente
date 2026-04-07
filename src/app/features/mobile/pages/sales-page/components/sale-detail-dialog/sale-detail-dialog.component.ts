import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { OptionsFlags } from 'src/app/shared/models/options-flag';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../../../../components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelHeaderDirective } from '../../../../components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../../../../components/sidenav-panel/sidenav-panel.component';
import { SalesDetail } from './../../../../../../root-store/sales-store/sales.models';

@Component({
  selector: 'app-sale-detail-dialog',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelHeaderDirective
  ],
  templateUrl: './sale-detail-dialog.component.html',
  styleUrls: ['./sale-detail-dialog.component.scss']
})

export class SaleDetailDialogComponent implements OnDestroy {
  private $unsub = new Subject();

  @Input() sale!: SalesDetail;
  @Input() visibilityOn: OptionsFlags<boolean> = false;
  @Output() confirm = new EventEmitter<DateRange<Date>>();
  @Output() close = new EventEmitter<void>();

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.close.next();
  }
}
