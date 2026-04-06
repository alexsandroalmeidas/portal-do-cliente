import { Action } from '@ngrx/store';
import {
  BankingAccountResponse, CancelScheduledPrepaymentResponse, FinalizePunctualRequest, FinalizePunctualResponse, FinalizeScheduledRequest,
  FinalizeScheduledResponse, GetAccreditationsResponse, GetAuthorizationResponse,
  GetAuthorizeResponse, GetHistoricResponse, GetRateResponse, GetScheduledFinalizedResponse, LeadAction, ReceivablesScheduleGroupingResponse, SaveLeadResponse
} from './prepayments.models';

export enum ActionTypes {
  GET_AUTHORIZATION = '@app/prepayments/get-authorization',
  GET_AUTHORIZATION_SUCCESS = '@app/prepayments/get-authorization-success',
  AUTHORIZE = '@app/prepayments/authorize',
  AUTHORIZE_SUCCESS = '@app/prepayments/authorize-success',
  SET_AUTHORIZED = '@app/prepayments/set-authorized',
  GET_FILTERED_RECEIVABLES_SCHEDULE_GROUPING = '@app/prepayments/get-receivables-schedule',
  GET_RECEIVABLES_SCHEDULE_SUCCESS = '@app/prepayments/get-receivables-schedule-success',
  GET_RECEIVABLES_SCHEDULE_GROUPING = '@app/prepayments/get-receivables-schedule-grouping',
  GET_RECEIVABLES_SCHEDULE_GROUPING_SUCCESS = '@app/prepayments/get-receivables-schedule-grouping-success',
  REQUEST_RECEIVABLES_SCHEDULE = '@app/prepayments/request-receivables-schedule',
  REQUEST_RECEIVABLES_SCHEDULE_SUCCESS = '@app/prepayments/request-receivables-schedule-success',
  FINALIZE_PUNCTUAL_PREPAYMENT = '@app/prepayments/finalize-punctual-prepayment',
  FINALIZE_PUNCTUAL_PREPAYMENT_SUCCESS = '@app/prepayments/finalize-punctual-prepayment-success',
  FINALIZED_PUNCTUAL_PREPAYMENT = '@app/prepayments/finalized-punctual-prepayment',
  GET_BANKING_ACCOUNT_PREPAYMENT = '@app/prepayments/get-banking-account-prepayment',
  GET_BANKING_ACCOUNT_PREPAYMENT_SUCCESS = '@app/prepayments/get-banking-account-prepayment-success',
  FINALIZE_SCHEDULED_PREPAYMENT = '@app/prepayments/finalize-scheduled-prepayment',
  FINALIZE_SCHEDULED_PREPAYMENT_SUCCESS = '@app/prepayments/finalize-scheduled-prepayment-success',
  FINALIZED_SCHEDULED_PREPAYMENT = '@app/prepayments/finalized-scheduled-prepayment',
  GET_PUNCTUAL_RATE_PREPAYMENT = '@app/prepayments/get-punctual-rate-prepayment',
  GET_PUNCTUAL_RATE_PREPAYMENT_SUCCESS = '@app/prepayments/get-punctual-rate-prepayment-success',
  GET_SCHEDULED_RATE_PREPAYMENT = '@app/prepayments/get-scheduled-rate-prepayment',
  GET_SCHEDULED_RATE_PREPAYMENT_SUCCESS = '@app/prepayments/get-scheduled-rate-prepayment-success',
  SET_NO_ERROR_SCHEDULED_PREPAYMENT = '@app/prepayments/set-no-error-scheduled-prepayment',
  SET_NO_ERROR_PUNCTUAL_PREPAYMENT = '@app/prepayments/set-no-error-punctual-prepayment',
  SET_NO_ERROR_AUTHORIZATION_PREPAYMENT = '@app/prepayments/set-no-error-authorization-prepayment',
  GET_SCHEDULED_FINALIZED = '@app/prepayments/get-scheduled-finalized',
  GET_SCHEDULED_FINALIZED_SUCCESS = '@app/prepayments/get-scheduled-finalized-success',
  GET_SCHEDULED_FINALIZED_FAILURE = '@app/prepayments/get-scheduled-finalized-failure',
  CANCEL_SCHEDULED_PREPAYMENT = '@app/prepayments/cancel-scheduled-prepayment',
  CANCEL_SCHEDULED_PREPAYMENT_SUCCESS = '@app/prepayments/cancel-scheduled-prepayment-success',
  CANCEL_SCHEDULED_PREPAYMENT_FAILURE = '@app/prepayments/cancel-scheduled-prepayment-failure',
  SET_CANCELED_SCHEDULED_PREPAYMENT = '@app/prepayments/set-canceled-scheduled-prepayment',
  GET_HISTORIC = '@app/prepayments/get-historic',
  GET_HISTORIC_SUCCESS = '@app/prepayments/get-historic-success',
  GET_HISTORIC_FAILURE = '@app/prepayments/get-historic-failure',
  GET_PUNCTUAL_ACCREDITATIONS = '@app/prepayments/get-punctual-accreditations',
  GET_PUNCTUAL_ACCREDITATIONS_SUCCESS = '@app/prepayments/get-punctual-accreditations-success',
  GET_PUNCTUAL_ACCREDITATIONS_FAILURE = '@app/prepayments/get-punctual-accreditations-failure',
  GET_SCHEDULED_ACCREDITATIONS = '@app/prepayments/get-scheduled-accreditations',
  GET_SCHEDULED_ACCREDITATIONS_SUCCESS = '@app/prepayments/get-scheduled-accreditations-success',
  GET_SCHEDULED_ACCREDITATIONS_FAILURE = '@app/prepayments/get-scheduled-accreditations-failure',
  SAVE_LEAD = '@app/prepayments/save-lead',
  SAVE_LEAD_SUCCESS = '@app/prepayments/save-lead-success',
  SAVE_LEAD_FAILURE = '@app/prepayments/save-lead-failure',

}

export class GetAuthorizationAction implements Action {
  readonly type = ActionTypes.GET_AUTHORIZATION;
  constructor(public payload: { uid: string }) { }
}

export class GetAuthorizationSuccessAction implements Action {
  readonly type = ActionTypes.GET_AUTHORIZATION_SUCCESS;
  constructor(public payload: { response: GetAuthorizationResponse }) { }
}

export class AuthorizeAction implements Action {
  readonly type = ActionTypes.AUTHORIZE;
  constructor(public payload: { uid: string }) { }
}

export class AuthorizeSuccessAction implements Action {
  readonly type = ActionTypes.AUTHORIZE_SUCCESS;
  constructor(public payload: { response: GetAuthorizeResponse }) { }
}

export class SetAuthorizedAction implements Action {
  readonly type = ActionTypes.SET_AUTHORIZED;
}

export class SetCanceledScheduledPrepaymentAction implements Action {
  readonly type = ActionTypes.SET_CANCELED_SCHEDULED_PREPAYMENT;
}

export class GetFilteredReceivablesScheduleAction implements Action {
  readonly type = ActionTypes.GET_FILTERED_RECEIVABLES_SCHEDULE_GROUPING;
  constructor(public payload: {
    documentNumber: string;
    receivablesScheduleGrouping: ReceivablesScheduleGroupingResponse[]
  }) { }
}

export class GetReceivablesScheduleSuccessAction implements Action {
  readonly type = ActionTypes.GET_RECEIVABLES_SCHEDULE_SUCCESS;
  constructor(public payload: { receivablesScheduleGrouping: ReceivablesScheduleGroupingResponse[] }) { }
}

export class GetReceivablesScheduleGroupingAction implements Action {
  readonly type = ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING;
  constructor(public payload: { uid: string[] }) { }
}

export class GetReceivablesScheduleGroupingSuccessAction implements Action {
  readonly type = ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING_SUCCESS;
  constructor(public payload: { receivablesScheduleGrouping: ReceivablesScheduleGroupingResponse[] }) { }
}

export class RequestReceivablesScheduleAction implements Action {
  readonly type = ActionTypes.REQUEST_RECEIVABLES_SCHEDULE;
  constructor(public payload: { uid: string; }) { }
}

export class RequestReceivablesScheduleSuccessAction implements Action {
  readonly type = ActionTypes.REQUEST_RECEIVABLES_SCHEDULE_SUCCESS;
}

export class FinalizePunctualPrepaymentAction implements Action {
  readonly type = ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT;
  constructor(public payload: { uid: string, schedules: FinalizePunctualRequest[] }) { }
}

export class FinalizePunctualPrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: FinalizePunctualResponse }) { }
}

export class FinalizedPunctualPrepaymentAction implements Action {
  readonly type = ActionTypes.FINALIZED_PUNCTUAL_PREPAYMENT;
}

export class GetBankingAccountPrepaymentAction implements Action {
  readonly type = ActionTypes.GET_BANKING_ACCOUNT_PREPAYMENT;
  constructor(public payload: { uid: string[] }) { }
}

export class GetBankingAccountPrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.GET_BANKING_ACCOUNT_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: BankingAccountResponse }) { }
}

export class FinalizeScheduledPrepaymentAction implements Action {
  readonly type = ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT;
  constructor(public payload: { request: FinalizeScheduledRequest }) { }
}

export class FinalizeScheduledPrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: FinalizeScheduledResponse }) { }
}

export class FinalizedScheduledPrepaymentAction implements Action {
  readonly type = ActionTypes.FINALIZED_SCHEDULED_PREPAYMENT;
}

export class GetPunctualRatePrepaymentAction implements Action {
  readonly type = ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT;
  constructor(public payload: { uid: string; prepaymentTotalAmount: number }) { }
}

export class GetPunctualRatePrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: GetRateResponse }) { }
}

export class GetScheduledRatePrepaymentAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT;
  constructor(public payload: { uid: string; prepaymentTotalAmount: number }) { }
}

export class GetScheduledRatePrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: GetRateResponse }) { }
}

export class SetNoErrorScheduledPrepaymentAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_SCHEDULED_PREPAYMENT;
}

export class SetNoErrorPunctualPrepaymentAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_PUNCTUAL_PREPAYMENT;
}

export class SetNoErrorAuthorizationPrepaymentAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_AUTHORIZATION_PREPAYMENT;
}

export class GetScheduledFinalizedAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_FINALIZED;
  constructor(public payload: { uid: string }) { }
}

export class GetScheduledFinalizedSuccessAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_FINALIZED_SUCCESS;
  constructor(public payload: { response: GetScheduledFinalizedResponse }) { }
}

export class GetScheduledFinalizedFailureAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_FINALIZED_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class CancelScheduledPrepaymentAction implements Action {
  readonly type = ActionTypes.CANCEL_SCHEDULED_PREPAYMENT;
  constructor(public payload: { id: string, uid: string }) { }
}

export class CancelScheduledPrepaymentSuccessAction implements Action {
  readonly type = ActionTypes.CANCEL_SCHEDULED_PREPAYMENT_SUCCESS;
  constructor(public payload: { response: CancelScheduledPrepaymentResponse }) { }
}

export class CancelScheduledPrepaymentFailureAction implements Action {
  readonly type = ActionTypes.CANCEL_SCHEDULED_PREPAYMENT_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class GetHistoricAction implements Action {
  readonly type = ActionTypes.GET_HISTORIC;
  constructor(public payload: { uid: string, initialDate: string, finalDate: string }) { }
}

export class GetHistoricSuccessAction implements Action {
  readonly type = ActionTypes.GET_HISTORIC_SUCCESS;
  constructor(public payload: { response: GetHistoricResponse }) { }
}

export class GetHistoricFailureAction implements Action {
  readonly type = ActionTypes.GET_HISTORIC_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class GetPunctualAccreditationsAction implements Action {
  readonly type = ActionTypes.GET_PUNCTUAL_ACCREDITATIONS;
  constructor(public payload: { uid: string }) { }
}

export class GetPunctualAccreditationsSuccessAction implements Action {
  readonly type = ActionTypes.GET_PUNCTUAL_ACCREDITATIONS_SUCCESS;
  constructor(public payload: { response: GetAccreditationsResponse }) { }
}

export class GetPunctualAccreditationsFailureAction implements Action {
  readonly type = ActionTypes.GET_PUNCTUAL_ACCREDITATIONS_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class GetScheduledAccreditationsAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_ACCREDITATIONS;
  constructor(public payload: { uid: string }) { }
}

export class GetScheduledAccreditationsSuccessAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_ACCREDITATIONS_SUCCESS;
  constructor(public payload: { response: GetAccreditationsResponse }) { }
}

export class GetScheduledAccreditationsFailureAction implements Action {
  readonly type = ActionTypes.GET_SCHEDULED_ACCREDITATIONS_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class SaveLeadAction implements Action {
  readonly type = ActionTypes.SAVE_LEAD;
  constructor(public payload: {
    uid: string,
    leadAction: LeadAction,
    itStarted: boolean,
    finished: boolean,
    canceled: boolean
  }) { }
}

export class SaveLeadSuccessAction implements Action {
  readonly type = ActionTypes.SAVE_LEAD_SUCCESS;
  constructor(public payload: { response: SaveLeadResponse }) { }
}

export class SaveLeadFailureAction implements Action {
  readonly type = ActionTypes.SAVE_LEAD_FAILURE;
  constructor(public payload: { error: any }) { }
}

export type Actions =
  | GetAuthorizationAction
  | GetAuthorizationSuccessAction
  | GetFilteredReceivablesScheduleAction
  | GetReceivablesScheduleSuccessAction
  | GetReceivablesScheduleGroupingAction
  | GetReceivablesScheduleGroupingSuccessAction
  | RequestReceivablesScheduleAction
  | RequestReceivablesScheduleSuccessAction
  | FinalizePunctualPrepaymentAction
  | FinalizePunctualPrepaymentSuccessAction
  | FinalizedPunctualPrepaymentAction
  | GetBankingAccountPrepaymentAction
  | GetBankingAccountPrepaymentSuccessAction
  | FinalizeScheduledPrepaymentAction
  | FinalizedScheduledPrepaymentAction
  | FinalizeScheduledPrepaymentSuccessAction
  | GetPunctualRatePrepaymentAction
  | GetPunctualRatePrepaymentSuccessAction
  | GetScheduledRatePrepaymentAction
  | GetScheduledRatePrepaymentSuccessAction
  | SetNoErrorScheduledPrepaymentAction
  | SetNoErrorPunctualPrepaymentAction
  | SetNoErrorAuthorizationPrepaymentAction
  | AuthorizeAction
  | AuthorizeSuccessAction
  | SetAuthorizedAction
  | GetScheduledFinalizedAction
  | GetScheduledFinalizedSuccessAction
  | GetScheduledFinalizedFailureAction
  | CancelScheduledPrepaymentAction
  | CancelScheduledPrepaymentSuccessAction
  | CancelScheduledPrepaymentFailureAction
  | SetCanceledScheduledPrepaymentAction
  | GetHistoricAction
  | GetHistoricSuccessAction
  | GetHistoricFailureAction
  | GetPunctualAccreditationsAction
  | GetPunctualAccreditationsSuccessAction
  | GetPunctualAccreditationsFailureAction
  | GetScheduledAccreditationsAction
  | GetScheduledAccreditationsSuccessAction
  | GetScheduledAccreditationsFailureAction
  | SaveLeadAction
  | SaveLeadSuccessAction
  | SaveLeadFailureAction;
