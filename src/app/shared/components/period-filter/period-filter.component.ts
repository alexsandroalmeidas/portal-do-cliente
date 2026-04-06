import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { filter } from 'rxjs/operators';
import { CustomPeriodSelectorDialogComponent } from '.';
import { FilterSelection, FilterTime, LabelFilter, PeriodFilter } from './models';

const DefaultDateFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.scss']
})
export class PeriodFilterComponent implements OnInit, OnChanges {
  currentValue!: FilterSelection;
  lastValue!: FilterSelection;
  bsModalRef!: BsModalRef;
  currentPeriod!: PeriodFilter;

  labels: { [key: string]: LabelFilter } = {
    past: {
      oneDay: 'Ontem',
      weekly: 'Últimos 7 dias',
      monthly: 'Últimos 30 dias'
    },
    future: {
      oneDay: 'Amanhã',
      weekly: 'Próximos 7 dias',
      monthly: 'Próximos 30 dias'
    }
  };

  @Input() customInitialDate!: string;
  @Input() customFinalDate!: string;
  @Input() initialValue!: FilterSelection;
  @Input() limitDays!: number;
  @Input() time: FilterTime = 'past';
  @Input() dateFormat!: string;
  @Output() changeValue = new EventEmitter<PeriodFilter>();
  @Input() title = 'Período';
  @Input() justCustom: boolean = false;

  get isFuture() {
    return this.time === 'future';
  }

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    switch (this.initialValue) {
      case 'today':
        this.selectToday();
        break;

      case 'oneDay':
        this.selectOneDay();
        break;

      case 'weekly':
        this.selectWeekly();
        break;

      case 'monthly':
        this.selectMonthly();
        break;

      case 'custom':
        {
          this.currentValue = 'custom';
          this.currentPeriod = {
            initialDate: new Date(this.customInitialDate).format(
              this.dateFormat || DefaultDateFormat
            ),
            finalDate: new Date(this.customFinalDate).format(this.dateFormat || DefaultDateFormat)
          };

          this.changeValue.emit(this.currentPeriod);
        }
        break;

      default:
        break;
    }
  }

  selectToday() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'today') {
      this.currentValue = 'today';

      this.currentPeriod = {
        initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
        finalDate: new Date().format(this.dateFormat || DefaultDateFormat)
      };
    }

    this.changeValue.emit(this.currentPeriod);
  }

  selectOneDay() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'oneDay') {
      this.currentValue = 'oneDay';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().addDays(1).format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().addDays(1).format(this.dateFormat || DefaultDateFormat)
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date().addDays(-1).format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().addDays(-1).format(this.dateFormat || DefaultDateFormat)
        };
      }
    }

    this.changeValue.emit(this.currentPeriod);
  }

  selectWeekly() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'weekly') {
      this.currentValue = 'weekly';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().addDays(7).format(this.dateFormat || DefaultDateFormat)
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date().addDays(-7).format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat)
        };
      }
    }

    this.changeValue.emit(this.currentPeriod);
  }

  selectMonthly() {
    this.lastValue = this.currentValue;

    if (this.currentValue !== 'monthly') {
      this.currentValue = 'monthly';

      if (this.isFuture) {
        this.currentPeriod = {
          initialDate: new Date().format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().addDays(30).format(this.dateFormat || DefaultDateFormat)
        };
      } else {
        this.currentPeriod = {
          initialDate: new Date().addDays(-30).format(this.dateFormat || DefaultDateFormat),
          finalDate: new Date().format(this.dateFormat || DefaultDateFormat)
        };
      }
    }

    this.changeValue.emit(this.currentPeriod);
  }

  selectCustom() {
    this.lastValue = this.currentValue;

    const initialState: ModalOptions = {
      initialState: {
        period: this.currentPeriod,
        limitDays: this.limitDays,
        dateFormat: this.dateFormat || DefaultDateFormat,
        time: this.time
      },
      class: 'modal-sm'
    };

    this.bsModalRef = this.modalService.show(CustomPeriodSelectorDialogComponent, initialState);

    this.bsModalRef.content.onClose
      .pipe(filter((result) => !!result))
      .subscribe((result: PeriodFilter) => {
        this.currentValue = 'custom';
        this.currentPeriod = result;

        this.changeValue.emit(this.currentPeriod);
      });
  }

  ngOnChanges() {
    this.changeValue.emit(this.currentPeriod);
  }
}
