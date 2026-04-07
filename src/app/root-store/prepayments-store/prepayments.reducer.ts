import { Actions, ActionTypes } from './prepayments.actions';
import {
  ReceivablesScheduleGroupingResponse,
  PrepaymentRate,
} from './prepayments.models';
import { PrepaymentsState, initialState } from './prepayments.state';

const filterPrepaymentsGrouping = (
  prepaymentsGrouping: ReceivablesScheduleGroupingResponse[],
  documentNumber: string,
): ReceivablesScheduleGroupingResponse[] => {
  return prepaymentsGrouping.filter((prepayment) => {
    return prepayment.documentNumber === documentNumber;
  });
};

export function featureReducer(
  state = initialState,
  action: Actions,
): PrepaymentsState {
  switch (action.type) {
    case ActionTypes.GET_AUTHORIZATION:
    case ActionTypes.GET_FILTERED_RECEIVABLES_SCHEDULE_GROUPING:
    case ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING:
    case ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT:
    case ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT:
    case ActionTypes.GET_SCHEDULED_FINALIZED:
    case ActionTypes.REQUEST_RECEIVABLES_SCHEDULE:
    case ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT:
    case ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT:
    case ActionTypes.CANCEL_SCHEDULED_PREPAYMENT:
    case ActionTypes.GET_HISTORIC:
    case ActionTypes.SAVE_LEAD:
    case ActionTypes.GET_PUNCTUAL_ACCREDITATIONS:
    case ActionTypes.GET_SCHEDULED_ACCREDITATIONS: {
      return {
        ...state,
        isLoading: true,
        scheduledError: null,
        punctualError: null,
        authorizationError: null,
        scheduledPrepaymentFinalized: false,
        punctualPrepaymentFinalized: false,
      };
    }
    case ActionTypes.GET_AUTHORIZATION_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        authorization: response.hasAuthorization,
        authorizationError: response.error,
      };
    }
    case ActionTypes.AUTHORIZE_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        authorizationError: response.error,
        authorized: !response.error,
      };
    }
    case ActionTypes.SET_AUTHORIZED: {
      return {
        ...state,
        authorized: true,
      };
    }
    case ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING_SUCCESS: {
      let { receivablesScheduleGrouping } = action.payload;

      return {
        ...state,
        receivablesScheduleGrouping,
        receivablesScheduleAvailable: receivablesScheduleGrouping.every(
          (x) => x.available,
        ),
      };
    }
    case ActionTypes.GET_FILTERED_RECEIVABLES_SCHEDULE_GROUPING: {
      let {
        receivablesScheduleGrouping,
        documentNumber: documentNumberSelected,
      } = action.payload;

      return {
        ...state,
        receivablesScheduleGrouping,
        filteredReceivablesScheduleGrouping: filterPrepaymentsGrouping(
          receivablesScheduleGrouping,
          documentNumberSelected,
        ),
      };
    }
    case ActionTypes.REQUEST_RECEIVABLES_SCHEDULE_SUCCESS: {
      return {
        ...state,
        requestedReceivablesSchedule: true,
      };
    }
    case ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        punctualPrepaymentFinalized: response.schedules.every((x) => x.success),
        punctualError: response.error,
      };
    }
    case ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        scheduledPrepaymentFinalized: response.success,
        scheduledError: response.error,
      };
    }
    case ActionTypes.GET_BANKING_ACCOUNT_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        bankingAccounts: response.bankingAccounts,
      };
    }
    case ActionTypes.FINALIZED_PUNCTUAL_PREPAYMENT: {
      return {
        ...state,
        punctualPrepaymentFinalized: null as any,
        punctualError: null,
      };
    }
    case ActionTypes.FINALIZED_SCHEDULED_PREPAYMENT: {
      return {
        ...state,
        scheduledPrepaymentFinalized: null as any,
        scheduledError: null,
      };
    }
    case ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        punctualRate: {
          rate: response.rate,
          maxLimit: response.maxLimit,
          minLimit: response.minLimit,
        } as PrepaymentRate,
        punctualError: response.error,
      };
    }
    case ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        scheduledRate: {
          rate: response.rate,
          maxLimit: response.maxLimit,
          minLimit: response.minLimit,
        } as PrepaymentRate,
        scheduledError: response.error,
      };
    }
    case ActionTypes.SET_NO_ERROR_PUNCTUAL_PREPAYMENT: {
      return {
        ...state,
        punctualError: null,
      };
    }
    case ActionTypes.SET_NO_ERROR_SCHEDULED_PREPAYMENT: {
      return {
        ...state,
        scheduledError: null,
      };
    }
    case ActionTypes.SET_NO_ERROR_AUTHORIZATION_PREPAYMENT: {
      return {
        ...state,
        authorizationError: null,
      };
    }
    case ActionTypes.GET_SCHEDULED_FINALIZED_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        scheduledFinalized: response,
        scheduledError: response.error,
      };
    }
    case ActionTypes.GET_SCHEDULED_FINALIZED_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        scheduledError: error,
      };
    }
    case ActionTypes.CANCEL_SCHEDULED_PREPAYMENT_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        canceledScheduled: response.success,
        scheduledError: response.error,
      };
    }
    case ActionTypes.CANCEL_SCHEDULED_PREPAYMENT_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        scheduledError: error,
      };
    }
    case ActionTypes.SET_CANCELED_SCHEDULED_PREPAYMENT: {
      return {
        ...state,
        canceledScheduled: false,
      };
    }
    case ActionTypes.GET_HISTORIC_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        historic: response.schedules,
        punctualError: response.error,
      };
    }
    case ActionTypes.GET_HISTORIC_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        punctualError: error,
      };
    }
    case ActionTypes.GET_PUNCTUAL_ACCREDITATIONS_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        punctualAccreditations: response.accreditations,
        punctualError: response.error,
      };
    }
    case ActionTypes.GET_PUNCTUAL_ACCREDITATIONS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        punctualError: error,
      };
    }
    case ActionTypes.GET_SCHEDULED_ACCREDITATIONS_SUCCESS: {
      let { response } = action.payload;

      return {
        ...state,
        scheduledAccreditations: response.accreditations,
        scheduledError: response.error,
      };
    }
    case ActionTypes.GET_SCHEDULED_ACCREDITATIONS_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        scheduledError: error,
      };
    }
    default:
      return {
        ...state,
      };
  }
}
