import { isEmpty } from 'lodash';
import moment from 'moment';
import { Actions, ActionTypes } from './sales.actions';
import { SalesDetail, SalesDetailFiltersOptions } from './sales.models';
import { initialState, SalesState } from './sales.state';

const filterSales = (
  salesDetails: SalesDetail[],
  selectedFilterOptions: SalesDetailFiltersOptions,
): SalesDetail[] => {
  return salesDetails.filter((sale) => {
    return (
      selectedFilterOptions.paymentTypes.some(
        (paymentType) => sale.paymentType === paymentType,
      ) &&
      selectedFilterOptions.status.some((status) => sale.status === status) &&
      selectedFilterOptions.cardBrands.some(
        (cardBrand) => sale.cardBrand === cardBrand,
      ) &&
      (!isEmpty(selectedFilterOptions.nsus)
        ? selectedFilterOptions.nsus.some((nsu) => nsu === sale.nsu)
        : true) &&
      (!isEmpty(selectedFilterOptions.salesTimes)
        ? selectedFilterOptions.salesTimes.some(
            (saleTime) => saleTime === moment(sale.saleDate).format('HH:mm'),
          )
        : true)
    );
  });
};

export function featureReducer(
  state = initialState,
  action: Actions,
): SalesState {
  switch (action.type) {
    case ActionTypes.SELECT_SALES_DETAIL:
    case ActionTypes.SELECT_SALES_DETAIL_EXCEL:
    case ActionTypes.SELECT_SALES_CALENDAR_EXCEL:
    case ActionTypes.SELECT_LAST_UPDATE_DATE_SALES:
    case ActionTypes.SELECT_LAST_SALES_SUMMARY: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_SALES_DETAIL: {
      const { result } = action.payload;

      const allDetails = result || [];

      const cardBrands = [...new Set(allDetails.map((p) => p.cardBrand))];
      const paymentTypes = [...new Set(allDetails.map((p) => p.paymentType))];
      const status = [...new Set(allDetails.map((p) => p.status))];
      const nsus = [...new Set(allDetails.map((p) => p.nsu))];
      const salesTimes = [
        ...new Set(allDetails.map((p) => moment(p.saleDate).format('HH:mm'))),
      ];

      let selectedSalesDetailFiltersOptions = {
        cardBrands,
        paymentTypes,
        status,
        nsus,
        salesTimes,
      };

      return {
        ...state,
        salesDetail: allDetails,
        salesDetailFiltersOptions: {
          cardBrands,
          paymentTypes,
          status,
          nsus,
          salesTimes,
        },
        selectedSalesDetailFiltersOptions,
        filteredSalesDetail: filterSales(
          allDetails,
          selectedSalesDetailFiltersOptions,
        ),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.FILTER_SALES_DETAILS: {
      const { salesDetail } = state;
      const { filter } = action.payload;
      const { cardBrands, paymentTypes, status, nsus, salesTimes } = filter;

      const selectedSalesDetailFiltersOptions = {
        cardBrands,
        paymentTypes,
        status,
        nsus,
        salesTimes,
      };

      return {
        ...state,
        selectedSalesDetailFiltersOptions: selectedSalesDetailFiltersOptions,
        filteredSalesDetail: filterSales(
          salesDetail,
          selectedSalesDetailFiltersOptions,
        ),
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_SALES_CALENDAR: {
      const { result } = action.payload;

      return {
        ...state,
        salesCalendar: result || [],
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_SALES_CALENDAR_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        salesCalendarError: error,
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_SUMMARY_CARD_SALES: {
      const { result } = action.payload;

      return {
        ...state,
        salesSummaryCardSales: result || [],
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_SUMMARY_CARD_SALES_FAILURE: {
      let { error } = action.payload;

      return {
        ...state,
        salesSummaryCardSalesError: error,
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_SALES_DETAIL_EXCEL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        salesDetailExcelFile: action.payload.result,
      };
    }
    case ActionTypes.LOAD_SALES_CALENDAR_EXCEL: {
      return {
        ...state,
        isLoading: false,
        error: null,
        salesCalendarExcelFile: action.payload.result,
      };
    }
    case ActionTypes.DOWNLOADED_SALES_CALENDAR_EXCEL: {
      return {
        ...state,
        salesCalendarExcelFile: null as any,
      };
    }
    case ActionTypes.DOWNLOADED_SALES_DETAIL_EXCEL: {
      return {
        ...state,
        salesDetailExcelFile: null as any,
      };
    }
    case ActionTypes.LOAD_LAST_UPDATE_DATE_SALES: {
      const { result } = action.payload;

      return {
        ...state,
        lastUpdateDate: result || null,
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.LOAD_LAST_SALES_SUMMARY: {
      const { result } = action.payload;

      return {
        ...state,
        lastSalesSummary: result || [],
        isLoading: false,
        error: null,
      };
    }
    default:
      return {
        ...state,
      };
  }
}
