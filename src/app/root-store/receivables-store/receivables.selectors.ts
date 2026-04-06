import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  Adjustment,
  LastUpdateDateReceivables,
  Receivable,
  ReceivableCalendar,
  ReceivableDetail,
  SummaryCardReceivables
} from './receivables.models';
import { ReceivablesDetailFiltersOptions, ReceivablesState } from './receivables.state';

const selectReceivablesState = createFeatureSelector<ReceivablesState>('receivables');

export const selectPastReceivables: MemoizedSelector<object, Receivable[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Receivable[] => state.pastReceivables);

export const selectReceivablesSummary: MemoizedSelector<object, SummaryCardReceivables> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): SummaryCardReceivables => state.receivablesSummary);

export const selectReceivablesCalendar: MemoizedSelector<object, ReceivableCalendar[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): ReceivableCalendar[] => state.receivablesCalendar);

export const selectReceivablesDetail: MemoizedSelector<object, ReceivableDetail[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): ReceivableDetail[] => state.receivablesDetail);

export const selectFilteredReceivablesDetail: MemoizedSelector<object, ReceivableDetail[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): ReceivableDetail[] => state.filteredReceivablesDetail
);

export const selectReceivablesDetailFilters: MemoizedSelector<object, ReceivablesDetailFiltersOptions> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): ReceivablesDetailFiltersOptions => state.receivablesDetailFiltersOptions
);

export const selectSelectedReceivablesDetailFilters: MemoizedSelector<object, ReceivablesDetailFiltersOptions | undefined> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): ReceivablesDetailFiltersOptions | undefined => state.selectedReceivablesDetailFiltersOptions
);

export const selectReceivablesDetailExcel: MemoizedSelector<object, Blob> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Blob => state.receivablesDetailExcelFile
);

export const selectReceivablesCalendarExcel: MemoizedSelector<object, Blob> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Blob => state.receivablesCalendarExcelFile
);

export const selectAdjustmentsCalendar: MemoizedSelector<object, Adjustment[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Adjustment[] => state.adjustmentsCalendar);

export const selectAdjustmentsDetail: MemoizedSelector<object, Adjustment[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Adjustment[] => state.adjustmentsDetail);

export const selectAdjustmentsSummary: MemoizedSelector<object, Adjustment[]> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): Adjustment[] => state.adjustmentsSummary);

export const selectLastUpdateDateReceivables: MemoizedSelector<object, LastUpdateDateReceivables> = createSelector(
  selectReceivablesState,
  (state: ReceivablesState): LastUpdateDateReceivables => state.lastUpdateDate);
