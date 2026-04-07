import { Establishment } from '@/root-store/administration-store/administration.models';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from '@/root-store/prepayments-store';
import { GetHistoricItemResponse } from '@/root-store/prepayments-store/prepayments.models';
import { AppState } from '@/root-store/state';
import { ExpansionPanelItemComponent } from '@/shared/components/expansion-panel/expansion-panel-item.component';
import { ExpansionPanelComponent } from '@/shared/components/expansion-panel/expansion-panel.component';
import { SharedModule } from '@/shared/shared.module';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DateRange } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PeriodFilterDialogComponent } from 'src/app/features/mobile/components/period-filter-dialog/period-filter-dialog.component';
import { SidenavService } from 'src/app/features/mobile/services/sidenav.service';
import {
  BottomSheetPanelBodyDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-body.directive';
import {
  BottomSheetPanelFooterDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import {
  BottomSheetPanelHeaderToolsDirective
} from '../../../../components/bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../../../../components/bottom-sheet-panel/bottom-sheet-panel.component';
import { PrepaymentsPeriodFilter } from '../../../../models/period-filter';
import { PrepaymentsPeriod } from './../../../../models/period-filter';

@Component({
  templateUrl: './prepayments-history-bottom-sheet.component.html',
  styleUrls: ['./prepayments-history-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective,
    ExpansionPanelComponent,
    ExpansionPanelItemComponent,
    PeriodFilterDialogComponent
  ],
})
export class PrepaymentsHistoryBottomSheetComponent implements OnInit, AfterViewInit, OnDestroy {

  private $unsub = new Subject();

  today = new Date().date();

  historic: GetHistoricItemResponse[] = [];
  filter: PrepaymentsPeriodFilter = new PrepaymentsPeriodFilter('lastWeek');

  protected get hasSelectedEstablishments() {
    return this.data.enableSelectedAllEstablishments || !Array.isEmpty(this.data.selectedEstablishments);
  }

  constructor(
    private store$: Store<AppState>,
    private bottomSheetRef: MatBottomSheetRef<PrepaymentsHistoryBottomSheetComponent>,
    public sidenavService: SidenavService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      establishments: Establishment[];
      enableSelectedAllEstablishments: boolean;
      selectedEstablishments: string[];
    }) { }

  ngOnInit() {
    this.subscribeGetHistoric();
  }

  ngAfterViewInit(): void {
    this.selectGetHistoric();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  handleClose() {
    this.bottomSheetRef.dismiss();
  }

  private selectGetHistoric() {
    if (this.hasSelectedEstablishments && !!this.filter) {
      const { end = null, start = null } = this.filter?.range ?? {};

      if (start && end) {
        this.store$.dispatch(new PrepaymentsStoreActions.GetHistoricAction(
          {
            uid: this.data.selectedEstablishments[0],
            initialDate: start.format(),
            finalDate: end.format()
          }));
      }
    }
  }

  private subscribeGetHistoric() {
    this.store$
      .select(PrepaymentsStoreSelectors.selectHistoric)
      .pipe(takeUntil(this.$unsub))
      .subscribe((historic) => {
        this.historic = [...(historic ?? [])];
      });
  }

  async onChangeDatePeriod(period: PrepaymentsPeriod) {
    this.filter = new PrepaymentsPeriodFilter(
      period,
      period === 'custom'
        ? new DateRange<Date>(
          this.today.addMonths(-3),
          this.today.addDays(1).addSeconds(-1)
        )
        : undefined);

    this.selectGetHistoric();
  }


  async onChangeDateRange(range: DateRange<Date>) {
    await this.sidenavService.close();

    this.filter = new PrepaymentsPeriodFilter('custom', range);

    this.selectGetHistoric();
  }

}
