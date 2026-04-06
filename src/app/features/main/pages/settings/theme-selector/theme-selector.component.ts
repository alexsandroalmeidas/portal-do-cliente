import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule],
})
export class ThemeSelectorComponent { }
