import { SharedModule } from '@/shared/shared.module';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class TooltipComponent {
  /**
   * Posição do tooltip
   * Exemplos: "top", "bottom", "left", "right",
   * "bottom left", "bottom right", "top left", "top right"
   */
  @Input() position: string = 'top';

  @Input() icon?: string;
}
