import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  host: { class: 'd-flex align-items-center justify-content-center gap-2' },
  imports: [
    CommonModule
  ]
})
export class StepperComponent implements OnChanges {
  @Input() totalSteps: number = 0;
  @Input() active: number = 0;
  @Input() color: 'white' | 'gray' = 'white';

  steps: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalSteps']) {
      this.steps = Array.from(Array(this.totalSteps).keys());
    }
  }
}
