import { Action } from '@ngrx/store';
import { GenericApiResult } from 'src/app/shared/models/api-result';
import {
  EconomicGroupBankingAccountsResponse,
  EconomicGroupPhoneNumberResponse,
  EconomicGroupRatesResponse,
  EconomicGroupReserveResponse,
  Establishment
} from './administration.models';

export enum ActionTypes {
  GET_ECONOMIC_GROUPS = '@app/administration/get-economic-groups',
  GET_ECONOMIC_GROUPS_SUCCESS = '@app/administration/get-economic-groups-success',
  SET_USER_CUSTOMERS = '@app/administration/set-user-customers',
  SET_USER_CUSTOMERS_SUCCESS = '@app/administration/set-user-customers-success',
  SELECT_USER_CUSTOMERS_RELOAD = '@app/administration/select-user-customers-reload',
  USER_LOG = '@app/administration/user-log',
  USER_LOG_SUCCESS = '@app/administration/user-log-success',
  GET_ECONOMIC_GROUP_PHONE = '@app/administration/get-economic-group-phone',
  GET_ECONOMIC_GROUP_PHONE_SUCCESS = '@app/administration/get-economic-group-phone-success',
  GET_ECONOMIC_GROUP_PHONE_FAILURE = '@app/administration/get-economic-group-phone-failure',
  SET_NO_ERROR_GET_ECONOMIC_GROUP_PHONE = '@app/administration/set-no-error-get-economic-group-phone',
  GET_ECONOMIC_GROUP_RATES = '@app/administration/get-economic-group-rates',
  GET_ECONOMIC_GROUP_RATES_SUCCESS = '@app/administration/get-economic-group-rates-success',
  GET_ECONOMIC_GROUP_RATES_FAILURE = '@app/administration/get-economic-group-rates-failure',
  SET_NO_ERROR_GET_ECONOMIC_GROUP_RATES = '@app/administration/set-no-error-get-economic-group-rates',
  SET_ACTIVE_MFA = '@app/administration/set-active-mfa',
  GET_ECONOMIC_GROUP_BANKING_ACCOUNTS = '@app/administration/get-economic-group-banking-accounts',
  GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_SUCCESS = '@app/administration/get-economic-group-banking-accounts-success',
  GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_FAILURE = '@app/administration/get-economic-group-banking-accounts-failure',
  SET_NO_ERROR_GET_ECONOMIC_GROUP_BANKING_ACCOUNTS = '@app/administration/set-no-error-get-economic-group-banking-accounts',
  GET_ECONOMIC_GROUP_RESERVE = '@app/administration/get-economic-group-reserve',
  GET_ECONOMIC_GROUP_RESERVE_SUCCESS = '@app/administration/get-economic-group-reserve-success',
  GET_ECONOMIC_GROUP_RESERVE_FAILURE = '@app/administration/get-economic-group-reserve-failure',
  RESET_ADMINISTRATION_STATE = '@app/administration/reset-administration-state'
}

export class GetEconomicGroupAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUPS;
  constructor(public payload: { eId: string }) {}
}

export class GetEconomicGroupSuccessAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUPS_SUCCESS;
  constructor(public payload: { establishments: Establishment[] }) {}
}

export class SetUserCustomersAction implements Action {
  readonly type = ActionTypes.SET_USER_CUSTOMERS;
  constructor(public payload: { uids: string[] }) {}
}

export class SetUserCustomersSuccessAction implements Action {
  readonly type = ActionTypes.SET_USER_CUSTOMERS_SUCCESS;
  constructor(public payload: { rowKey: string }) {}
}

export class UserLogAction implements Action {
  readonly type = ActionTypes.USER_LOG;
  constructor(public payload: { userName: string; action: string }) {}
}

export class UserLogSuccessAction implements Action {
  readonly type = ActionTypes.USER_LOG_SUCCESS;
  constructor(public payload: { rowKey: string }) {}
}

export class GetEconomicGroupPhoneAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_PHONE;
}

export class GetEconomicGroupPhoneSuccessAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_PHONE_SUCCESS;
  constructor(public payload: { response: GenericApiResult<EconomicGroupPhoneNumberResponse> }) {}
}

export class GetEconomicGroupPhoneFailureAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_PHONE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetNoErrorGetEconomicGroupPhoneAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_PHONE;
}

export class GetEconomicGroupRatesAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RATES;
  constructor(public payload: { uid: string }) {}
}

export class GetEconomicGroupRatesSuccessAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RATES_SUCCESS;
  constructor(public payload: { response: GenericApiResult<EconomicGroupRatesResponse> }) {}
}

export class GetEconomicGroupRatesFailureAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RATES_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetNoErrorGetEconomicGroupRatesAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_RATES;
}

export class GetEconomicGroupReserveAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RESERVE;
  constructor(public payload: { uids: string[] }) {}
}

export class GetEconomicGroupReserveSuccessAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RESERVE_SUCCESS;
  constructor(public payload: { response: GenericApiResult<EconomicGroupReserveResponse> }) {}
}

export class GetEconomicGroupReserveFailureAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_RESERVE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetActiveMfaAction implements Action {
  readonly type = ActionTypes.SET_ACTIVE_MFA;
  constructor(public payload: { email: string }) {}
}

export class GetEconomicGroupBankingAccountsAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS;
  constructor(public payload: { uid: string }) {}
}

export class GetEconomicGroupBankingAccountsSuccessAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_SUCCESS;
  constructor(
    public payload: { response: GenericApiResult<EconomicGroupBankingAccountsResponse> }
  ) {}
}

export class GetEconomicGroupBankingAccountsFailureAction implements Action {
  readonly type = ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class SetNoErrorGetEconomicGroupBankingAccountsAction implements Action {
  readonly type = ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_BANKING_ACCOUNTS;
}

export class ResetAdministrationStateAction implements Action {
  readonly type = ActionTypes.RESET_ADMINISTRATION_STATE;
}

export type Actions =
  | GetEconomicGroupAction
  | GetEconomicGroupSuccessAction
  | SetUserCustomersAction
  | SetUserCustomersSuccessAction
  | UserLogAction
  | UserLogSuccessAction
  | GetEconomicGroupPhoneAction
  | GetEconomicGroupPhoneSuccessAction
  | GetEconomicGroupPhoneFailureAction
  | SetNoErrorGetEconomicGroupPhoneAction
  | GetEconomicGroupRatesAction
  | GetEconomicGroupRatesSuccessAction
  | GetEconomicGroupRatesFailureAction
  | SetNoErrorGetEconomicGroupRatesAction
  | SetActiveMfaAction
  | GetEconomicGroupBankingAccountsAction
  | GetEconomicGroupBankingAccountsSuccessAction
  | GetEconomicGroupBankingAccountsFailureAction
  | SetNoErrorGetEconomicGroupBankingAccountsAction
  | GetEconomicGroupReserveAction
  | GetEconomicGroupReserveSuccessAction
  | GetEconomicGroupReserveFailureAction
  | ResetAdministrationStateAction;
