import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { GetAccreditationsItemResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-card-prepayments-accreditations',
  templateUrl: './card-prepayments-accreditations.component.html',
  styleUrls: ['./card-prepayments-accreditations.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class CardPrepaymentsAccreditationsComponent implements OnInit, OnDestroy {
  protected $unsub = new Subject();

  @Input() accreditations: GetAccreditationsItemResponse[] = [];
  @Input() showTitle = true;
  @Output() selectedAccreditations = new EventEmitter<any>();
  selection = new SelectionModel<any>(true, []);

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCheckboxChange(e: any, accreditation: GetAccreditationsItemResponse) {
    this.selection.toggle(accreditation);

    let checkedValues = [];

    for (let i = 0; i < this.selection.selected.length; i++) {
      checkedValues.push(this.selection.selected[i].documentNumber);
    }

    this.selectedAccreditations.emit(checkedValues);
  }
}
