import { Directive } from '@angular/core';

@Directive({
  selector: '[bottomSheetPanelHeaderTools]',
  host: { 'class': 'bottom-sheet-panel-header-tools' },
  standalone: true
})
export class BottomSheetPanelHeaderToolsDirective { }
