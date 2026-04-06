import { LastUpdateDateSales, SalesCalendar, SalesDetail, SalesDetailFiltersOptions, SummaryCardSales, SummaryLastSales } from './sales.models';

export interface SalesState {
  isLoading?: boolean;
  error?: any;
  salesSummaryCardSales: SummaryCardSales;
  salesSummaryCardSalesError: string;
  lastSalesSummary: SummaryLastSales[];
  salesDetail: SalesDetail[];
  filteredSalesDetail: SalesDetail[];
  salesDetailFiltersOptions: SalesDetailFiltersOptions;
  selectedSalesDetailFiltersOptions?: SalesDetailFiltersOptions;
  salesCalendar: SalesCalendar[];
  salesCalendarError: string;
  salesDetailExcelFile: Blob;
  salesCalendarExcelFile: Blob;
  lastUpdateDate: LastUpdateDateSales;
}

export const initialState: SalesState = {
  isLoading: false,
  error: null,
  salesSummaryCardSales: null as any,
  salesSummaryCardSalesError: null as any,
  lastSalesSummary: [],
  salesDetail: [],
  filteredSalesDetail: [],
  salesDetailFiltersOptions: {
    cardBrands: [],
    paymentTypes: [],
    status: [],
    nsus: [],
    salesTimes: []
  },
  salesCalendar: [],
  salesCalendarError: null as any,
  salesDetailExcelFile: null as any,
  salesCalendarExcelFile: null as any,
  lastUpdateDate: null as any,
};
