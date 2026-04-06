import { Directive } from '@angular/core';

@Directive({
  selector: '[panelTitle]',
  host: { 'class': 'panel-title' },
  standalone: true
})
export class ExpansionPanelItemTitleDirective { }
