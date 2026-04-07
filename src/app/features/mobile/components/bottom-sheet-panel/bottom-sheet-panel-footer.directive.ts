import { Directive } from '@angular/core';

@Directive({
  selector: '[bottomSheetPanelFooter]',
  host: { 'class': 'bottom-sheet-panel-footer' },
  standalone: true
})
export class BottomSheetPanelFooterDirective { }
