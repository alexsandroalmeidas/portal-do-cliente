import { Directive } from '@angular/core';

@Directive({
  selector: '[bottomSheetPanelBody]',
  host: { 'class': 'bottom-sheet-panel-body' },
  standalone: true
})
export class BottomSheetPanelBodyDirective { }
