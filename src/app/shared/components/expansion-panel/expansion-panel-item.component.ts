import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpansionPanelItemContentDirective } from './expansion-panel-item-content.directive';
import { ExpansionPanelItemTitleDirective } from './expansion-panel-item-title.directive';

@Component({
  selector: 'app-expansion-panel-item',
  template: `
    <div class="d-flex align-items-center w-100">
      <ng-content select="[panelTitle]"></ng-content>

      <div class="flex-fill"></div>

      <button *ngIf="expandable"
        class="btn bg-transparent d-flex align-items-center justify-content-center border-0 p-0"
        (click)="handleToggle()">
        <mat-icon *ngIf="collapsed; else expanded_icon">
          keyboard_arrow_down
        </mat-icon>

        <ng-template #expanded_icon>
          <mat-icon>keyboard_arrow_up</mat-icon>
        </ng-template>
      </button>
    </div>
    <div class="panel-content"
         [class.collapsed]="collapsed"
         [@collapse]="collapsed">
      <ng-content select="[panelContent]"></ng-content>
    </div>
  `,
  host: {
    'class': `d-flex flex-column w-100`,
    '[class.py-3]': '!collapsed',
    'style': 'border-radius: 1.5rem'
  },
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('225ms ease-in')),
      transition('true => false', animate('225ms ease-out'))
    ])
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ExpansionPanelItemComponent {
  collapsed = true;

  @Input() expandable: boolean = true;

  @ContentChild(ExpansionPanelItemTitleDirective) panelTitle!: ExpansionPanelItemTitleDirective;
  @ContentChild(ExpansionPanelItemContentDirective) panelContent!: ExpansionPanelItemContentDirective;

  handleToggle() {
    this.collapsed = !this.collapsed;
  }

  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }
}
