import { Component, ContentChild, Input } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { BottomSheetPanelBodyDirective } from './bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from './bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from './bottom-sheet-panel-header-tools.directive';

@Component({
  selector: 'app-bottom-sheet-panel',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './bottom-sheet-panel.component.html',
  styleUrls: ['./bottom-sheet-panel.component.scss'],
  host: { 'class': 'bottom-sheet-panel' }
})
export class BottomSheetPanelComponent {
  @Input() hasHeader: boolean = true;

  @ContentChild(BottomSheetPanelBodyDirective) bottomSheetPanelBody!: BottomSheetPanelBodyDirective;
  @ContentChild(BottomSheetPanelFooterDirective) bottomSheetPanelFooter!: BottomSheetPanelFooterDirective;
  @ContentChild(BottomSheetPanelHeaderToolsDirective) bottomSheetPanelHeaderTools?: BottomSheetPanelHeaderToolsDirective;
}
