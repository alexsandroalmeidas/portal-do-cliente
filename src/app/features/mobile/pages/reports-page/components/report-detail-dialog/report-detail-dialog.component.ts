import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from '../../../../components/sidenav-panel/sidenav-panel-body.directive';
import { SidenavPanelFooterDirective } from '../../../../components/sidenav-panel/sidenav-panel-footer.directive';
import { SidenavPanelHeaderDirective } from '../../../../components/sidenav-panel/sidenav-panel-header.directive';
import { SidenavPanelComponent } from '../../../../components/sidenav-panel/sidenav-panel.component';
import { ReportRequest } from './../../../../../../root-store/reports-store/reports.models';

@Component({
  selector: 'app-report-detail-dialog',
  standalone: true,
  imports: [
    SharedModule,
    SidenavPanelComponent,
    SidenavPanelBodyDirective,
    SidenavPanelFooterDirective,
    SidenavPanelHeaderDirective
  ],
  templateUrl: './report-detail-dialog.component.html',
  styleUrls: ['./report-detail-dialog.component.scss']
})
export class ReportDetailDialogComponent implements OnDestroy {
  private $unsub = new Subject();

  @Input() request!: ReportRequest;
  @Output() download = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  canDownload() {
    return this.request.progressStatus.toLocaleLowerCase().includes('concluído');
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onDownload() {
    this.download.emit(this.request.id);
  }

  onClose() {
    this.close.next();
  }
}
