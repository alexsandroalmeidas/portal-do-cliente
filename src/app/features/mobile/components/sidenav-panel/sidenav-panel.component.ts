import { Component, ContentChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SidenavPanelBodyDirective } from './sidenav-panel-body.directive';
import { SidenavPanelFooterDirective } from './sidenav-panel-footer.directive';
import { SidenavPanelHeaderDirective } from './sidenav-panel-header.directive';

@Component({
  selector: 'app-sidenav-panel',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidenav-panel.component.html',
  styleUrls: ['./sidenav-panel.component.scss'],
  host: { 'class': 'sidenav-panel' }
})
export class SidenavPanelComponent {
  @ContentChild(SidenavPanelBodyDirective) sidenavPanelBody!: SidenavPanelBodyDirective;
  @ContentChild(SidenavPanelFooterDirective) sidenavPanelFooter!: SidenavPanelFooterDirective;
  @ContentChild(SidenavPanelHeaderDirective) sidenavPanelHeader?: SidenavPanelHeaderDirective;
}
