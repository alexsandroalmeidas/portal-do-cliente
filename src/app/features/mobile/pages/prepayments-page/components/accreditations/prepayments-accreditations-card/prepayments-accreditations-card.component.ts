import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetAccreditationsItemResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prepayments-accreditations-card',
  templateUrl: './prepayments-accreditations-card.component.html',
  styleUrls: ['./prepayments-accreditations-card.component.scss'],
  standalone: true,
  host: { class: 'd-flex flex-column gap-2' },
  imports: [
    SharedModule
  ],
})
export class PrepaymentsAccreditationsCardComponent {

  @Input() accreditations: GetAccreditationsItemResponse[] = [];
  @Input() hasError: boolean = false;
  @Output() selectedAccreditations = new EventEmitter<any>();

  selection = new SelectionModel<any>(true, []);

  textChange = '';

  isLastItem(index: number): boolean {
    return index === this.accreditations.length - 1;
  }

  onCheckboxChange(accreditation: GetAccreditationsItemResponse) {
    this.selection.toggle(accreditation);

    let checkedValues = [];

    for (let i = 0; i < this.selection.selected.length; i++) {
      checkedValues.push(this.selection.selected[i].documentNumber);
    }

    this.selectedAccreditations.emit(checkedValues);
  }

  onScroll(event: any) {

    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;
    const scrollTreshold = scrollHeight - scrollTop;

    if (scrollPosition > scrollTreshold) {
      this.textChange = 'white';

    } else {
      // this.textChange1 = 'var(--bs-secondary)';
      // this.textChange2 = 'var(--bs-primary)';
    }
  }
}
