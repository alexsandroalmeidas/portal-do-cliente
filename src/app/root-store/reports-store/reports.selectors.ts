import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ReportRequest } from './reports.models';
import { ReportsState } from './reports.state';

export const selectReportsState = createFeatureSelector<ReportsState>('reports');

export const selectRequests: MemoizedSelector<object, ReportRequest[]> = createSelector(
  selectReportsState,
  (state: ReportsState): ReportRequest[] => state.requests
);

export const selectLastRequest: MemoizedSelector<object, ReportRequest> = createSelector(
  selectReportsState,
  (state: ReportsState): ReportRequest => state.lastRequest
);

export const selectMovementsSalesExcel: MemoizedSelector<object, { blob: Blob; name: string }> =
  createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
    blob: state.salesMovementsExcel,
    name: state.salesMovementsExcelName
  }));

export const selectMovementsAllCardsExcel: MemoizedSelector<object, { blob: Blob; name: string }> =
  createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
    blob: state.allCardsMovementsExcel,
    name: state.allCardsMovementsExcelName
  }));

export const selectHistoricSalesExcel: MemoizedSelector<object, { blob: Blob; name: string }> =
  createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
    blob: state.salesHistoricExcel,
    name: state.salesHistoricExcelName
  }));

export const selectHistoricAllCardsExcel: MemoizedSelector<object, { blob: Blob; name: string }> =
  createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
    blob: state.allCardsHistoricExcel,
    name: state.allCardsHistoricExcelName
  }));

export const selectMovementsReceivablesExcel: MemoizedSelector<
  object,
  { blob: Blob; name: string }
> = createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
  blob: state.receivablesMovementsExcel,
  name: state.receivablesMovementsExcelName
}));

export const selectHistoricReceivablesExcel: MemoizedSelector<
  object,
  { blob: Blob; name: string }
> = createSelector(selectReportsState, (state: ReportsState): { blob: Blob; name: string } => ({
  blob: state.receivablesHistoricExcel,
  name: state.receivablesHistoricExcelName
}));
