import { Directive } from '@angular/core';

@Directive({
  selector: '[sidenavPanelBody]',
  host: { 'class': 'sidenav-panel-body' },
  standalone: true
})
export class SidenavPanelBodyDirective { }
