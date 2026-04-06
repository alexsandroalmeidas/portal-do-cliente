import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormValidators } from '../../../extras/form-validators';
import { PeriodFilter } from '../models';

@Component({
  templateUrl: './custom-period-selector-dialog.component.html',
  styleUrls: ['./custom-period-selector-dialog.component.scss'],
})
export class CustomPeriodSelectorDialogComponent implements OnInit {
  limitDays!: number;
  dateFormat!: string;
  period?: PeriodFilter;

  showIntervalError = false;

  form!: FormGroup;

  public onClose!: Subject<PeriodFilter>;

  get formControls() {
    return this.form.controls;
  }

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    bsLocaleService: BsLocaleService,
  ) {
    bsLocaleService.use('pt-br');
  }

  ngOnInit() {
    this.onClose = new Subject<PeriodFilter>();

    this.form = this.formBuilder.group({
      dateRange: [[], [Validators.required]],
    });

    if (!!this.period) {
      this.form.patchValue({
        dateRange: [
          new Date(this.period.initialDate),
          new Date(this.period.finalDate),
        ],
      });
    }
  }

  onSubmit() {
    FormValidators.checkFormValidations(this.form);

    if (this.form.valid) {
      const { dateRange } = this.form.value as { dateRange: Date[] };
      const initialDate = dateRange[0];
      const finalDate = dateRange[1];

      if (finalDate.diff(initialDate, 'days') > this.limitDays) {
        this.showIntervalError = true;
        return;
      }

      const result: PeriodFilter = {
        initialDate: initialDate.format(this.dateFormat),
        finalDate: finalDate.format(this.dateFormat),
      };

      this.onClose.next(result);
      this.bsModalRef.hide();
    }
  }

  onCancellClick(): void {
    this.bsModalRef.hide();
  }
}
