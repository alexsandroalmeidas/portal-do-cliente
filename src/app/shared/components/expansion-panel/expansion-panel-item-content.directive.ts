import { Directive } from '@angular/core';

@Directive({
  selector: '[panelContent]',
  host: { 'class': 'expansion-panel-item-content' },
  standalone: true
})
export class ExpansionPanelItemContentDirective {
}
