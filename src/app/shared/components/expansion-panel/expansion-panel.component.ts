import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { ExpansionPanelItemComponent } from './expansion-panel-item.component';

@Component({
  selector: 'app-expansion-panel',
  template: `
    <ng-content></ng-content>
  `,
  host: { 'class': 'd-flex flex-column align-items-center gap-2' },
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ExpansionPanelComponent {
  @ContentChildren(ExpansionPanelItemComponent) content!: QueryList<ExpansionPanelItemComponent>;
}
