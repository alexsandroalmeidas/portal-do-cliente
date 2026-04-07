import { Directive } from '@angular/core';

@Directive({
  selector: '[sidenavPanelFooter]',
  host: { 'class': 'sidenav-panel-footer' },
  standalone: true
})
export class SidenavPanelFooterDirective { }
