import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModelDay } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-weekly-activation',
  templateUrl: './weekly-activation.component.html',
  styleUrls: ['./weekly-activation.component.scss'],
  standalone: true,
  host: { class: 'd-flex flex-column gap-2' },
  imports: [
    SharedModule
  ],
})
export class WeeklyActivationComponent {

  @Input() daysOfWeek: SelectionModelDay[] = [];
  @Input() hasError: boolean = false;
  @Output() selectedDaysOfWeek = new EventEmitter<SelectionModelDay[]>();

  selection = new SelectionModel<SelectionModelDay>(true, []);

  selectionOrder: number[] = [];

  isLastItem(index: number): boolean {
    return index === this.daysOfWeek.length - 1;
  }

  onCheckboxChange(dayOfWeek: SelectionModelDay) {
    this.selection.toggle(dayOfWeek);

    if (this.selection.isSelected(dayOfWeek)) {
      this.selectionOrder.push(dayOfWeek.day);
    } else {
      this.selectionOrder = this.selectionOrder
        .filter(day => day !== dayOfWeek.day);
    }

    this.selectedDaysOfWeek.emit(this.selection.selected);
  }

  dayHasError(dayOfWeek: SelectionModelDay) {
    if (!this.hasError || this.selection.selected.length < 3) {
      return false;
    }

    const selection = this.selection.selected
      .slice(-(this.selection.selected.length - 2))
      .map(d => d.day);

    return selection.includes(dayOfWeek.day);
  }
}
