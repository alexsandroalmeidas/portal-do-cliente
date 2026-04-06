import { SelectionModel } from '@angular/cdk/collections';
import { OnInit, OnDestroy, Component, ViewChild, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import {
  BankingAccount,
  FinalCheck,
  PrepaymentsViewMode,
  SelectionModelDay,
} from 'src/app/root-store/prepayments-store/prepayments.models';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-scheduled-prepayment',
  templateUrl: './dialog-scheduled-prepayment.component.html',
  styleUrls: ['./dialog-scheduled-prepayment.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class DialogScheduledPrepaymentComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();
  finalCheck: FinalCheck = {} as FinalCheck;
  viewMode: PrepaymentsViewMode = 'initial';
  viewModeControl = new UntypedFormControl(this.viewMode);
  bankingAccount: BankingAccount = {} as BankingAccount;
  selection = new SelectionModel<SelectionModelDay>(true, []);
  isEdit = false;
  selectedDatesS: string[] = [];
  selectedDates: number[] = [];
  minDate = moment('2023-12-01');
  maxDate = moment('2023-12-31');

  schedules = [
    {
      title: 'Diariamente',
      description: 'Receba suas vendas no dia útil seguinte',
      isDaily: true,
      isWeekly: false,
      isMonthly: false,
    },
    {
      title: 'Semanalmente',
      description: 'Receba suas vendas toda semana, nos dias escolhidos',
      isDaily: false,
      isWeekly: true,
      isMonthly: false,
    },
    {
      title: 'Mensalmente',
      description: 'Receba suas vendas em dias específicos no mês',
      isDaily: false,
      isWeekly: false,
      isMonthly: true,
    },
  ];

  daysOfWeek = [
    {
      day: 1,
      description: 'Segunda-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 2,
      description: 'Terça-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 3,
      description: 'Quarta-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 4,
      description: 'Quinta-feira',
      selected: false,
    } as SelectionModelDay,
    {
      day: 5,
      description: 'Sexta-feira',
      selected: false,
    } as SelectionModelDay,
  ];

  get verifyDisable() {
    if (this.viewMode === 'weekly') {
      return !this.selection.hasValue();
    } else if (this.viewMode === 'monthly') {
      return isEmpty(this.selectedDates);
    }

    return false;
  }

  @ViewChild(MatCalendar, { static: false }) calendar!: MatCalendar<Date>;

  constructor(
    private dialogRef: MatDialogRef<DialogScheduledPrepaymentComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.bankingAccount = data.bankingAccount;
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onOpenContinue(schedule: any) {
    this.loadFinalCheck();

    if (schedule.isDaily) {
      this.dialogRef.close(this.finalCheck);
    } else if (schedule.isWeekly) {
      this.viewMode = 'weekly';
      this.viewModeControl.setValue(this.viewMode);
    } else if (schedule.isMonthly) {
      this.viewMode = 'monthly';
      this.viewModeControl.setValue(this.viewMode);
    }
  }

  private loadFinalCheck() {
    let selection = null as any;

    if (this.viewMode === 'weekly') {
      if (this.selection.hasValue()) {
        if (this.selection.selected.length === 1) {
          selection = this.selection.selected[0].description;
        } else {
          const listOrdered = this.selection.selected.sortBy((x) => x.day);
          selection = `${listOrdered[0].description} e ${listOrdered[1].description}`;
        }
      }
    } else if (this.viewMode === 'monthly') {
      if (!isEmpty(this.selectedDates)) {
        if (this.selectedDates.length === 1) {
          selection = this.selectedDates[0];
        } else {
          const listOrdered = this.selectedDates.sortBy((x) => x);
          selection = `${listOrdered[0]} e ${listOrdered[1]}`;
        }
      }
    }

    const frequency =
      this.viewMode === 'monthly'
        ? 'dayOfMonth'
        : this.viewMode === 'weekly'
          ? 'weekday'
          : 'daily';

    this.finalCheck = {
      selectionDescription: selection,
      viewMode: this.viewMode,
      isActivate: true,
      isCancel: false,
      isEdit: this.isEdit,
      isContinue: false,
      daysOfWeek: this.selection?.selected.map((x) => x.day),
      daysOfMonth: this.selectedDates,
      frequency,
    } as FinalCheck;
  }

  onContinueClick() {
    this.loadFinalCheck();
    this.finalCheck.isContinue = true;

    this.dialogRef.close(this.finalCheck);
  }

  onCancelClick(): void {
    this.loadFinalCheck();
    this.finalCheck.isCancel = true;

    this.dialogRef.close(this.finalCheck);
  }

  dateClass: MatCalendarCellClassFunction<Moment> = (cellDate, view) => {
    if (view == 'month') {
      let dateToFind = this.getDateOnly(cellDate);
      let i = this.selectedDatesS.indexOf(dateToFind);
      if (i >= 0) {
        return 'selected';
      }
    }
    return '';
  };

  daySelected(date: Moment | null, calendar: any) {
    if (date) {
      let dateSelected = this.getDateOnly(date);
      let index = this.selectedDatesS.indexOf(dateSelected);
      if (index >= 0) {
        this.selectedDatesS.splice(index, 1);

        let indexOther = this.selectedDates.indexOf(date.date());
        this.selectedDates.splice(indexOther, 1);
      } else {
        if (this.selectedDatesS.length < 2) {
          this.selectedDatesS.push(dateSelected);
          this.selectedDates.push(date.date());
        }
      }
      calendar.updateTodaysDate();
    }
  }

  getDateOnly(date: Moment): string {
    return date.toISOString().split('T')[0];
  }
}
