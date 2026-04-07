import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-background',
  templateUrl: './toolbar-background.component.html',
  styleUrls: ['./toolbar-background.component.scss'],
  standalone: true
})
export class ToolbarBackgroundComponent {
  @Input() top: string = '-835px';
  @Input() left: string = '-306px';
}
