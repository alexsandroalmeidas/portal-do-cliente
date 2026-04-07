import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ReceivablesPeriod, ReceivablesPeriodFilter } from '../../models/period-filter';
import { BottomSheetPanelBodyDirective } from '../bottom-sheet-panel/bottom-sheet-panel-body.directive';
import { BottomSheetPanelFooterDirective } from '../bottom-sheet-panel/bottom-sheet-panel-footer.directive';
import { BottomSheetPanelHeaderToolsDirective } from '../bottom-sheet-panel/bottom-sheet-panel-header-tools.directive';
import { BottomSheetPanelComponent } from '../bottom-sheet-panel/bottom-sheet-panel.component';
import { CoreStoreSelectors } from './../../../../root-store';
import { ReceivablesStoreActions, ReceivablesStoreSelectors } from './../../../../root-store/receivables-store';
import { SummaryCardReceivables } from './../../../../root-store/receivables-store/receivables.models';
import { AppState } from './../../../../root-store/state';
import { SharedModule } from './../../../../shared/shared.module';

@Component({
  selector: 'app-sales-details-dialog',
  templateUrl: './receivables-card-dialog.component.html',
  styleUrls: ['./receivables-card-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    BottomSheetPanelComponent,
    BottomSheetPanelHeaderToolsDirective,
    BottomSheetPanelBodyDirective,
    BottomSheetPanelFooterDirective
  ]
})
export class ReceivablesCardDialogComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  form!: UntypedFormGroup;

  filter: ReceivablesPeriodFilter;
  values: SummaryCardReceivables = {} as SummaryCardReceivables;
  visibilityOn: boolean = false;
  updatedDate: Date = new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private store$: Store<AppState>,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<ReceivablesCardDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      selectedEstablishments: string[];
      currentFilter: ReceivablesPeriodFilter;
      showDetailsButtom: boolean;
      visibilityOn: boolean;
    }) {

    this.visibilityOn = data.visibilityOn;
    this.filter = data.currentFilter;
  }

  ngOnInit() {
    this.store$
      .pipe(
        select(CoreStoreSelectors.selectOverscrolling),
        takeUntil(this.$unsub)
      )
      .subscribe(overscrolling => {
        if (overscrolling) {
          this.onClose();
        }
      });

    this.form = this.fb.group({
      period: [this.filter.period, []]
    });

    this.form.get('period')?.valueChanges
      .pipe(takeUntil(this.$unsub))
      .subscribe((period: ReceivablesPeriod) => {
        this.filter = new ReceivablesPeriodFilter(period);
        this.onFilterReceivables();
      });

    this.subscribeReceivablesDetails();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onClose() {
    this.bottomSheetRef.dismiss();
  }

  private subscribeReceivablesDetails() {
    this.store$
      .select(ReceivablesStoreSelectors.selectReceivablesSummary)
      .pipe(takeUntil(this.$unsub))
      .subscribe((receivablesDetail: SummaryCardReceivables) => {
        this.values = receivablesDetail;
      });
  }

  private onFilterReceivables() {
    const { start, end } = this.filter.range;

    if (start && end) {
      this.store$.dispatch(
        new ReceivablesStoreActions.SelectReceivablesSummaryAction({
          initialDate: start.format(),
          finalDate: end.format(),
          uids: this.data.selectedEstablishments
        })
      );
    }
  }

  async goToReceivables() {
    this.onClose();

    const { range: { start, end } } = this.filter;

    await this.router.navigate(
      ['/receivables/mobile'],
      {
        queryParams: {
          start: start?.format('YYYY-MM-DD'),
          end: end?.format('YYYY-MM-DD')
        }
      });
  }
}
