import { Actions, ActionTypes } from './receivables.actions';
import { ReceivableDetail, SummaryCardReceivables } from './receivables.models';
import { initialState, ReceivablesDetailFiltersOptions, ReceivablesState } from './receivables.state';

const filterReceivables = (receivablesDetails: ReceivableDetail[], selectedFilterOptions: ReceivablesDetailFiltersOptions): ReceivableDetail[] => {
  return receivablesDetails
    .filter(receivable => {
      return selectedFilterOptions.paymentTypes.some(paymentType => receivable.paymentType === paymentType)
        && selectedFilterOptions.status.some(status => receivable.paymentStatus === status)
        && selectedFilterOptions.cardBrands.some(cardBrand => receivable.cardBrand === cardBrand)
        && selectedFilterOptions.releaseTypes.some(releaseType => receivable.releaseTypeDescription === releaseType);
    });
}

export function featureReducer(state = initialState, action: Actions): ReceivablesState {
  switch (action.type) {
    case ActionTypes.SELECT_ADJUSTMENTS_SUMMARY:
    case ActionTypes.SELECT_ADJUSTMENTS_DETAIL:
    case ActionTypes.SELECT_ADJUSTMENTS_CALENDAR:
    case ActionTypes.SELECT_RECEIVABLES_DETAIL_EXCEL:
    case ActionTypes.SELECT_RECEIVABLES_CALENDAR_EXCEL:
    case ActionTypes.SELECT_RECEIVABLES_CALENDAR:
    case ActionTypes.SELECT_RECEIVABLES_DETAIL:
    case ActionTypes.SELECT_RECEIVABLES_SUMMARY:
    case ActionTypes.SELECT_LAST_UPDATE_DATE_RECEIVABLES:
    case ActionTypes.SELECT_PAST_RECEIVABLES: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_PAST_RECEIVABLES: {
      const { result } = action.payload;

      return {
        ...state,
        pastReceivables: (result || []),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_RECEIVABLES_SUMMARY: {
      const { result } = action.payload;

      return {
        ...state,
        receivablesSummary: result || {} as SummaryCardReceivables,
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_RECEIVABLES_DETAIL: {
      const { result: receivablesDetail } = action.payload;

      const allDetails = receivablesDetail || [];

      const cardBrands = [...new Set(allDetails.map(p => p.cardBrand))];
      const paymentTypes = [...new Set(allDetails.map(p => p.paymentType))];
      const status = [...new Set(allDetails.map(p => p.paymentStatus))];
      const releaseTypes = [...new Set(allDetails.map(p => p.releaseTypeDescription))];

      let selectedReceivablesDetailFiltersOptions = {
        cardBrands,
        paymentTypes,
        status,
        releaseTypes
      };

      return {
        ...state,
        receivablesDetail: allDetails,
        receivablesDetailFiltersOptions: { cardBrands, paymentTypes, status, releaseTypes },
        selectedReceivablesDetailFiltersOptions,
        filteredReceivablesDetail: filterReceivables(allDetails, selectedReceivablesDetailFiltersOptions),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.FILTER_RECEIVABLES_DETAILS: {
      const { receivablesDetail } = state;
      const { filter } = action.payload;
      const { cardBrands, paymentTypes, status, releaseTypes } = filter;

      const selectedReceivablesDetailFiltersOptions = { cardBrands, paymentTypes, status, releaseTypes };

      return {
        ...state,
        selectedReceivablesDetailFiltersOptions: selectedReceivablesDetailFiltersOptions,
        filteredReceivablesDetail: filterReceivables(receivablesDetail, selectedReceivablesDetailFiltersOptions),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_RECEIVABLES_CALENDAR: {
      const { result } = action.payload;

      return {
        ...state,
        receivablesCalendar: (result || []),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_RECEIVABLES_DETAIL_EXCEL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        receivablesDetailExcelFile: action.payload.result,
      };
    }
    case ActionTypes.LOAD_RECEIVABLES_CALENDAR_EXCEL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        receivablesCalendarExcelFile: action.payload.result,
      };
    }
    case ActionTypes.DOWNLOADED_RECEIVABLES_CALENDAR_EXCEL: {
      return {
        ...state,
        receivablesCalendarExcelFile: null as any,
      };
    }
    case ActionTypes.DOWNLOADED_RECEIVABLES_DETAIL_EXCEL: {
      return {
        ...state,
        receivablesDetailExcelFile: null as any,
      };
    }
    case ActionTypes.LOAD_ADJUSTMENTS_DETAIL: {
      const { result } = action.payload;

      return {
        ...state,
        adjustmentsDetail: (result || []),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_ADJUSTMENTS_CALENDAR: {
      const { result } = action.payload;

      return {
        ...state,
        adjustmentsCalendar: (result || []),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_ADJUSTMENTS_SUMMARY: {
      const { result } = action.payload;

      return {
        ...state,
        adjustmentsSummary: result || [],
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_LAST_UPDATE_DATE_RECEIVABLES: {
      const { result } = action.payload;

      return {
        ...state,
        lastUpdateDate: result || null,
        isLoading: false,
        error: null,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
