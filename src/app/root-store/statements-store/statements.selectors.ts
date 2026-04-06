import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Statement, StatementScheduling } from './statements.models';
import { StatementsState } from './statements.state';

const selectStatementsState = createFeatureSelector<StatementsState>('statements');

export const selectStatements: MemoizedSelector<object, Statement[]> = createSelector(
  selectStatementsState,
  (state: StatementsState): Statement[] => state.statements);

export const selectStatementsFileTxt: MemoizedSelector<object, Blob> = createSelector(
  selectStatementsState,
  (state: StatementsState): Blob => state.statementsFileTxt
);

export const selectStatementsFileXml: MemoizedSelector<object, Blob> = createSelector(
  selectStatementsState,
  (state: StatementsState): Blob => state.statementsFileXml
);

export const selectLastStatementsScheduling: MemoizedSelector<object, StatementScheduling[]> = createSelector(
  selectStatementsState,
  (state: StatementsState): StatementScheduling[] => state.lastStatementsScheduling
);

export const selectAddStatementsScheduling: MemoizedSelector<object, StatementScheduling> = createSelector(
  selectStatementsState,
  (state: StatementsState): StatementScheduling => state.statementsScheduling
);

export const selectUploadStatementFileValidate: MemoizedSelector<object, Blob> = createSelector(
  selectStatementsState,
  (state: StatementsState): Blob => state.statementsFileExcel
);
