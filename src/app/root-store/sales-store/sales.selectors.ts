import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { LastUpdateDateSales, SalesCalendar, SalesDetail, SalesDetailFiltersOptions, SummaryCardSales, SummaryLastSales } from './sales.models';
import { SalesState } from './sales.state';

export const selectSalesState = createFeatureSelector<SalesState>('sales');

export const selectSummaryCardSales: MemoizedSelector<object, SummaryCardSales> = createSelector(
  selectSalesState,
  (state: SalesState): SummaryCardSales => state.salesSummaryCardSales
);

export const selectSummaryCardSalesError: MemoizedSelector<object, string> = createSelector(
  selectSalesState,
  (state: SalesState): string => state.salesSummaryCardSalesError
);

export const selectLastSalesSummary: MemoizedSelector<object, SummaryLastSales[]> = createSelector(
  selectSalesState,
  (state: SalesState): SummaryLastSales[] => state.lastSalesSummary
);

export const selectSalesCalendar: MemoizedSelector<object, SalesCalendar[]> = createSelector(
  selectSalesState,
  (state: SalesState): SalesCalendar[] => state.salesCalendar
);

export const selectSalesDetail: MemoizedSelector<object, SalesDetail[]> = createSelector(
  selectSalesState,
  (state: SalesState): SalesDetail[] => state.salesDetail
);

export const selectFilteredSalesDetail: MemoizedSelector<object, SalesDetail[]> = createSelector(
  selectSalesState,
  (state: SalesState): SalesDetail[] => state.filteredSalesDetail
);

export const selectSalesDetailFilters: MemoizedSelector<object, SalesDetailFiltersOptions> = createSelector(
  selectSalesState,
  (state: SalesState): SalesDetailFiltersOptions => state.salesDetailFiltersOptions
);

export const selectSelectedSalesDetailFilters: MemoizedSelector<object, SalesDetailFiltersOptions | undefined> = createSelector(
  selectSalesState,
  (state: SalesState): SalesDetailFiltersOptions | undefined => state.selectedSalesDetailFiltersOptions
);

export const selectSalesDetailExcel: MemoizedSelector<object, Blob> = createSelector(
  selectSalesState,
  (state: SalesState): Blob => state.salesDetailExcelFile
);

export const selectSalesCalendarExcel: MemoizedSelector<object, Blob> = createSelector(
  selectSalesState,
  (state: SalesState): Blob => state.salesCalendarExcelFile);

export const selectLastUpdateDateSales: MemoizedSelector<object, LastUpdateDateSales> = createSelector(
  selectSalesState,
  (state: SalesState): LastUpdateDateSales => state.lastUpdateDate
);
