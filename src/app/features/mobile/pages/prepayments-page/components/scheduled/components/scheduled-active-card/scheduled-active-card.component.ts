import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { take } from 'rxjs';
import { getAccreditationName, GetScheduledFinalizedResponse } from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduledActiveCancelDialogComponent } from '../../../../../../components/scheduled-active-cancel-dialog/scheduled-active-cancel-dialog.component';

@Component({
  selector: 'app-prepayments-scheduled-active-card',
  standalone: true,
  templateUrl: './scheduled-active-card.component.html',
  styleUrls: ['./scheduled-active-card.component.scss'],
  imports: [
    SharedModule,
  ],
})
export class PrepaymentScheduledActiveCardComponent implements OnInit {

  @Input() hasSelectedEstablishment: boolean = false;
  @Input() documentNumberSelected: string = '';
  @Input() rate: number = 0;
  @Input() scheduledFinalized: GetScheduledFinalizedResponse = {} as GetScheduledFinalizedResponse;
  @Output() cancel = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<boolean>();

  get period() {

    if (!isEmpty(this.scheduledFinalized.daysOfWeek)) {
      const dayName = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");

      if (this.scheduledFinalized.daysOfWeek.length === 1) {
        return dayName[this.scheduledFinalized.daysOfWeek[0]];
      } else {
        const listOrdered = this.scheduledFinalized.daysOfWeek.sortBy(x => x);
        return `${dayName[listOrdered[0]]} - ${dayName[listOrdered[1]]}`;
      }
    }

    if (!isEmpty(this.scheduledFinalized.daysOfMonth)) {

      if (this.scheduledFinalized.daysOfMonth.length === 1) {
        return this.scheduledFinalized.daysOfMonth[0];
      } else {
        const listOrdered = this.scheduledFinalized.daysOfMonth.sortBy(x => x);

        return `${listOrdered[0]} e ${listOrdered[1]}`;
      }
    }

    return '';
  }

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goActivate() {
    await this.router.navigate(
      ['/prepayments/mobile/scheduled'],
      {
        queryParams: {
          uid: this.documentNumberSelected
        }
      });
  }

  async onEdit() {
    this.edit.next(true);
  }

  async onOpenScheduledCancelDialog() {

    const bottomSheetRef = this.bottomSheet.open(ScheduledActiveCancelDialogComponent, {
      panelClass: 'bottom-sheet-panel',
      hasBackdrop: true,
      disableClose: true,
      data: {}
    });

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((keep) => {
        if (keep === false) {
          this.cancel.next(true);
        }
      });
  }

  getAccreditationName(documentNumber: string) {
    return getAccreditationName(documentNumber);
  }
}
