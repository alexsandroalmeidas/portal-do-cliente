import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { PrepaymentsState } from './prepayments.state';
import {
  ReceivablesScheduleGroupingResponse,
  BankingAccount,
  PrepaymentRate,
  GetScheduledFinalizedResponse,
  GetHistoricItemResponse,
  GetAccreditationsItemResponse
} from './prepayments.models';


export const selectPrepaymentsState = createFeatureSelector<PrepaymentsState>('prepayments');

export const selectAuthorization: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.authorization
);

export const selectAuthorized: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.authorized
);

export const selectFilteredReceivablesSchedule: MemoizedSelector<object, ReceivablesScheduleGroupingResponse[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): ReceivablesScheduleGroupingResponse[] => state.filteredReceivablesScheduleGrouping
);

export const selectReceivablesScheduleGrouping: MemoizedSelector<object, ReceivablesScheduleGroupingResponse[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): ReceivablesScheduleGroupingResponse[] => state.receivablesScheduleGrouping
);

export const selectBankingAccounts: MemoizedSelector<object, BankingAccount[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): BankingAccount[] => state.bankingAccounts
);

export const selectRequestedReceivablesSchedule: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.requestedReceivablesSchedule
);

export const selectFinalizedPunctualPrepayment: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.punctualPrepaymentFinalized
);

export const selectPunctualRatePrepayment: MemoizedSelector<object, PrepaymentRate> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): PrepaymentRate => state.punctualRate
);

export const selectScheduledRatePrepayment: MemoizedSelector<object, PrepaymentRate> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): PrepaymentRate => state.scheduledRate
);

export const selectFinalizedScheduledPrepayment: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.scheduledPrepaymentFinalized
);

export const selectScheduledPrepaymentHasError: MemoizedSelector<object, string> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): string => state.scheduledError
);

export const selectPunctualPrepaymentHasError: MemoizedSelector<object, string> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): string => state.punctualError
);

export const selectAuthorizationPrepaymentHasError: MemoizedSelector<object, string> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): string => state.authorizationError
);

export const selectScheduledFinalizedPrepayment: MemoizedSelector<object, GetScheduledFinalizedResponse> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): GetScheduledFinalizedResponse => state.scheduledFinalized
);

export const selectCanceledScheduledPrepayment: MemoizedSelector<object, boolean> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): boolean => state.canceledScheduled
);

export const selectHistoric: MemoizedSelector<object, GetHistoricItemResponse[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): GetHistoricItemResponse[] => state.historic
);

export const selectPunctualAccreditations: MemoizedSelector<object, GetAccreditationsItemResponse[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): GetAccreditationsItemResponse[] => state.punctualAccreditations
);

export const selectScheduledAccreditations: MemoizedSelector<object, GetAccreditationsItemResponse[]> = createSelector(
  selectPrepaymentsState,
  (state: PrepaymentsState): GetAccreditationsItemResponse[] => state.scheduledAccreditations
);
