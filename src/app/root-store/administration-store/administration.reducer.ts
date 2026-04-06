import { environment } from 'src/environments/environment';
import { Actions, ActionTypes } from './administration.actions';
import { AdministrationState, initialState } from './administration.state';

export function featureReducer(
  state = initialState,
  action: Actions,
): AdministrationState {
  switch (action.type) {
    case ActionTypes.GET_ECONOMIC_GROUPS:
    case ActionTypes.GET_ECONOMIC_GROUP_RATES:
    case ActionTypes.GET_ECONOMIC_GROUP_RESERVE:
    case ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS:
    case ActionTypes.GET_ECONOMIC_GROUP_PHONE: {
      return {
        ...state,
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUPS_SUCCESS: {
      let { establishments } = action.payload;

      return {
        ...state,
        establishments,
      };
    }
    case ActionTypes.SET_USER_CUSTOMERS: {
      return {
        ...state,
        selectedEstablishments: action.payload.uids,
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_PHONE_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        economicGroupPhone:
          (environment.debug ? '51993408448' : response?.result?.phoneNumber) ||
          '',
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_PHONE_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        getEconomicGroupPhoneError: error,
      };
    }
    case ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_PHONE: {
      return {
        ...state,
        getEconomicGroupPhoneError: null,
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_RATES_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        economicGroupRates: response.result || (null as any),
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_RATES_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        getEconomicGroupRatesError: error,
      };
    }
    case ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_RATES: {
      return {
        ...state,
        getEconomicGroupRatesError: null,
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_RESERVE_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        economicGroupReserve: response.result || (null as any),
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_RESERVE_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        getEconomicGroupReserveError: error,
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        economicGroupBankingAccounts: response.result || (null as any),
      };
    }
    case ActionTypes.GET_ECONOMIC_GROUP_BANKING_ACCOUNTS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        getEconomicGroupBankingAccountsError: error,
      };
    }
    case ActionTypes.SET_NO_ERROR_GET_ECONOMIC_GROUP_BANKING_ACCOUNTS: {
      return {
        ...state,
        getEconomicGroupBankingAccountsError: null,
      };
    }

    case ActionTypes.RESET_ADMINISTRATION_STATE:
    default:
      return {
        ...state,
      };
  }
}
