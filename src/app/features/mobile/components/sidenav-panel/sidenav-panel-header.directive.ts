import { Directive } from '@angular/core';

@Directive({
  selector: '[sidenavPanelHeader]',
  host: { 'class': 'sidenav-panel-header' },
  standalone: true
})
export class SidenavPanelHeaderDirective { }
