import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-monthly-activation',
  templateUrl: './monthly-activation.component.html',
  styleUrls: ['./monthly-activation.component.scss'],
  standalone: true,
  host: { class: 'd-flex flex-column gap-2' },
  imports: [
    SharedModule
  ],
})
export class MonthlyActivationComponent {

  @Input() hasError: boolean = false;
  @Output() selectedDaysOfMonth = new EventEmitter<number[]>();

  daysOfMonth: number[] = Array.from(Array(30).keys()).map((day) => day + 1);
  selection = new SelectionModel<number>(true, []);
  selectionOrder: number[] = [];

  isLastItem(index: number): boolean {
    return index === this.daysOfMonth.length - 1;
  }

  onCheckboxChange(dayOfWeek: number) {
    this.selection.toggle(dayOfWeek);

    if (this.selection.isSelected(dayOfWeek)) {
      this.selectionOrder.push(dayOfWeek);
    } else {
      this.selectionOrder = this.selectionOrder
        .filter(day => day !== dayOfWeek);
    }

    this.selectedDaysOfMonth.emit(this.selection.selected);
  }

  dayHasError(dayOfMonth: number) {
    if (!this.hasError || this.selection.selected.length < 3) {
      return false;
    }

    const selection = this.selection.selected
      .slice(-(this.selection.selected.length - 2))
      .map(day => day);

    return selection.includes(dayOfMonth);
  }
}
