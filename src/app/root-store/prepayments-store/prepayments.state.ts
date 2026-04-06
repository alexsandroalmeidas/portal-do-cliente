import {
  ReceivablesScheduleGroupingResponse,
  BankingAccount,
  ReceivablesSchedule,
  PrepaymentRate,
  GetScheduledFinalizedResponse,
  GetHistoricItemResponse,
  GetAccreditationsItemResponse
} from './prepayments.models';

export interface PrepaymentsState {
  isLoading?: boolean;
  scheduledError?: any;
  punctualError?: any;
  authorizationError?: any;
  authorization: boolean;
  authorized: boolean;
  receivablesSchedule: ReceivablesSchedule[];
  receivablesScheduleGrouping: ReceivablesScheduleGroupingResponse[];
  receivablesScheduleAvailable: boolean;
  filteredReceivablesScheduleGrouping: ReceivablesScheduleGroupingResponse[];
  bankingAccounts: BankingAccount[];
  requestedReceivablesSchedule: boolean;
  punctualPrepaymentFinalized: boolean;
  scheduledPrepaymentFinalized: boolean;
  punctualRate: PrepaymentRate;
  scheduledRate: PrepaymentRate;
  scheduledFinalized: GetScheduledFinalizedResponse;
  canceledScheduled: boolean;
  historic: GetHistoricItemResponse[];
  punctualAccreditations: GetAccreditationsItemResponse[];
  scheduledAccreditations: GetAccreditationsItemResponse[];
}

export const initialState: PrepaymentsState = {
  isLoading: false,
  scheduledError: null as any,
  punctualError: null as any,
  authorizationError: null as any,
  authorization: false,
  authorized: false,
  receivablesSchedule: [],
  receivablesScheduleGrouping: [],
  receivablesScheduleAvailable: true,
  filteredReceivablesScheduleGrouping: [],
  bankingAccounts: [],
  requestedReceivablesSchedule: false,
  punctualPrepaymentFinalized: false,
  scheduledPrepaymentFinalized: false,
  punctualRate: null as any,
  scheduledRate: null as any,
  scheduledFinalized: null as any,
  canceledScheduled: false,
  historic: null as any,
  punctualAccreditations: null as any,
  scheduledAccreditations: null as any
};
