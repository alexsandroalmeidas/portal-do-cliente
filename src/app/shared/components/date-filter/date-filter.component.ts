import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { filter } from 'rxjs/operators';
import { CustomPeriodSelectorDialogComponent } from '.';
import { DateFilter, FilterSelection, FilterTime, LabelFilter } from './models';

const DefaultDateFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit, OnChanges {
  form!: FormGroup;
  currentValue!: FilterSelection;
  lastValue!: FilterSelection;
  bsModalRef!: BsModalRef;
  currentPeriod!: DateFilter;

  labels: { [key: string]: LabelFilter } = {
    past: {
      week: 'Última semana',
      month: 'Último mês',
      threeMonths: 'Últimos 3 meses',
      year: 'Último ano',
    },
    future: {
      week: 'Próxima semana',
      month: 'Próximo mês',
      threeMonths: 'Próximos 3 meses',
      year: 'Próximo ano',
    },
  };

  @Input() customInitialDate!: string;
  @Input() customFinalDate!: string;
  @Input() initialValue!: FilterSelection;
  @Input() limitDays!: number;
  @Input() time: FilterTime = 'past';
  @Input() dateFormat!: string;
  @Output() changeValue = new EventEmitter<DateFilter>();
  @Input() title = 'Período';
  @Input() justCustom: boolean = false;
  @Input() isPrimary: boolean = false;

  get isFuture() {
    return this.time === 'future';
  }

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      dateRange: [[], [Validators.required]],
    });

    if (!!this.currentPeriod) {
      this.form.patchValue({
        dateRange: [
          new Date(this.currentPeriod.initialDate),
          new Date(this.currentPeriod.finalDate),
        ],
      });
    }

    switch (this.initialValue) {
      case 'week':
        this.selectWeek();
        break;

      case 'month':
        this.selectMonth();
        break;

      case 'threeMonths':
        this.selectThreeMonths();
        break;

      case 'year':
        this.selectYear();
        break;

      case 'custom':
        {
          this.currentValue = 'custom';
          this.currentPeriod = {
            initialDate: new Date(this.customInitialDate).format(
              this.dateFormat || DefaultDateFormat,
            ),
            finalDate: new Date(this.customFinalDate).format(
              this.dateFormat || DefaultDateFormat,
            ),
          };

          this.changeValue.emit(this.currentPeriod);
        }
        break;

      default:
        break;
    }
  }

  onDateChange(event: any) {
    if (!!event && !isEmpty(event)) {
      this.currentPeriod = {
        initialDate: new Date(event[0]).format(
          this.dateFormat || DefaultDateFormat,
        ),
        finalDate: new Date(event[1]).format(
          this.dateFormat || DefaultDateFormat,
        ),
      };

      this.currentValue = 'custom';
    }

    this.ngOnChanges();
  }

  selectWeek() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'week') {
      this.currentValue = 'week';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date()
            .addDays(7)
            .format(this.dateFormat || DefaultDateFormat),
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date()
            .addDays(-7)
            .format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat),
        };
      }
    }

    this.form.patchValue({
      dateRange: [],
    });

    this.ngOnChanges();
  }

  selectMonth() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'month') {
      this.currentValue = 'month';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date()
            .addDays(30)
            .format(this.dateFormat || DefaultDateFormat),
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date()
            .addDays(-30)
            .format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat),
        };
      }
    }

    this.form.patchValue({
      dateRange: [],
    });

    this.ngOnChanges();
  }

  selectThreeMonths() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'threeMonths') {
      this.currentValue = 'threeMonths';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date()
            .addDays(90)
            .format(this.dateFormat || DefaultDateFormat),
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date()
            .addDays(-90)
            .format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat),
        };
      }
    }

    this.form.patchValue({
      dateRange: [],
    });

    this.ngOnChanges();
  }

  selectYear() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'year') {
      this.currentValue = 'year';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date()
            .addDays(365)
            .format(this.dateFormat || DefaultDateFormat),
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date()
            .addDays(-365)
            .format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat),
        };
      }
    }

    this.form.patchValue({
      dateRange: [],
    });

    this.ngOnChanges();
  }

  selectCustom() {
    this.lastValue = this.currentValue;

    const initialState = {
      period: this.currentPeriod,
      limitDays: this.limitDays,
      dateFormat: this.dateFormat || DefaultDateFormat,
      time: this.time,
    };

    this.bsModalRef = this.modalService.show(
      CustomPeriodSelectorDialogComponent,
      { class: 'modal-sm', initialState },
    );

    this.bsModalRef.content.onClose
      .pipe(filter((result) => !!result))
      .subscribe((result: DateFilter) => {
        this.currentValue = 'custom';
        this.currentPeriod = result;

        this.ngOnChanges();
      });
  }

  ngOnChanges() {
    this.changeValue.emit(this.currentPeriod);
  }
}
