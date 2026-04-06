import { Actions, ActionTypes } from './reports.actions';
import { initialState, ReportsState } from './reports.state';

export function featureReducer(
  state = initialState,
  action: Actions,
): ReportsState {
  switch (action.type) {
    case ActionTypes.LOAD_REQUESTS_REPORTS: {
      const requests = (action.payload.result || [])
        .sortBy((s) => s.id)
        .reverse();

      return {
        ...state,
        requests,
      };
    }
    case ActionTypes.LOAD_REQUEST_REPORTS: {
      const lastRequest = action.payload.result;

      const requests = [lastRequest, ...state.requests]
        .sortBy((s) => s.id)
        .reverse();

      return {
        ...state,
        requests,
        lastRequest,
      };
    }
    case ActionTypes.LOAD_LAST_REQUEST_REPORTS: {
      const lastRequest = action.payload.result;

      return {
        ...state,
        lastRequest,
      };
    }
    case ActionTypes.LOAD_MOVEMENTS_SALES_REPORTS_EXCEL: {
      return {
        ...state,
        salesMovementsExcel: action.payload.result,
        salesMovementsExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.LOAD_HISTORIC_SALES_REPORTS_EXCEL: {
      return {
        ...state,
        salesHistoricExcel: action.payload.result,
        salesHistoricExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.LOAD_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL: {
      return {
        ...state,
        allCardsMovementsExcel: action.payload.result,
        allCardsMovementsExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.LOAD_HISTORIC_ALL_CARDS_REPORTS_EXCEL: {
      return {
        ...state,
        allCardsHistoricExcel: action.payload.result,
        allCardsHistoricExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.LOAD_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL: {
      return {
        ...state,
        receivablesMovementsExcel: action.payload.result,
        receivablesMovementsExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.LOAD_HISTORIC_RECEIVABLES_REPORTS_EXCEL: {
      return {
        ...state,
        receivablesHistoricExcel: action.payload.result,
        receivablesHistoricExcelName: action.payload.fileName,
      };
    }
    case ActionTypes.DOWNLOADED_EXCEL_REPORTS: {
      return {
        ...state,
        salesMovementsExcel: null as any,
        salesMovementsExcelName: null as any,
        allCardsMovementsExcel: null as any,
        allCardsMovementsExcelName: null as any,
        receivablesMovementsExcel: null as any,
        receivablesMovementsExcelName: null as any,
        salesHistoricExcel: null as any,
        salesHistoricExcelName: null as any,
        allCardsHistoricExcel: null as any,
        allCardsHistoricExcelName: null as any,
        receivablesHistoricExcel: null as any,
        receivablesHistoricExcelName: null as any,
      };
    }
    case ActionTypes.ON_UPDATE_REQUEST_REPORTS: {
      const { result: request } = action.payload;

      let { lastRequest } = state;

      if (!!request && !!lastRequest && lastRequest.id === request.id) {
        lastRequest = request;
      }

      let requests = state.requests;

      const existingRequest = state.requests.find(
        (s) => !!request && s.id === request.id,
      );

      if (!!existingRequest) {
        requests = [
          request,
          ...state.requests.filter((s) => !!request && s.id !== request.id),
        ]
          .sortBy((s) => s.id)
          .reverse();
      }

      return {
        ...state,
        requests,
        lastRequest,
      };
    }
    default:
      return {
        ...state,
      };
  }
}
