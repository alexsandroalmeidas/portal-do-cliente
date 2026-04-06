import {
  Adjustment,
  LastUpdateDateReceivables,
  Receivable,
  ReceivableCalendar,
  ReceivableDetail,
  SummaryCardReceivables
} from './receivables.models';

export interface ReceivablesDetailFiltersOptions {
  cardBrands: string[];
  paymentTypes: string[];
  status: string[];
  releaseTypes: string[];
}

export interface ReceivablesState {
  isLoading?: boolean;
  error?: any;

  pastReceivables: Receivable[];
  receivablesSummary: SummaryCardReceivables;
  receivablesDetail: ReceivableDetail[];
  filteredReceivablesDetail: ReceivableDetail[];
  receivablesDetailFiltersOptions: ReceivablesDetailFiltersOptions;
  selectedReceivablesDetailFiltersOptions?: ReceivablesDetailFiltersOptions;
  receivablesCalendar: ReceivableCalendar[];
  receivablesDetailExcelFile: Blob;
  receivablesCalendarExcelFile: Blob;
  adjustmentsDetail: Adjustment[];
  adjustmentsCalendar: Adjustment[];
  adjustmentsSummary: Adjustment[];
  lastUpdateDate: LastUpdateDateReceivables;
}

export const initialState: ReceivablesState = {
  isLoading: false,
  error: null,
  pastReceivables: [],
  receivablesSummary: {} as SummaryCardReceivables,
  receivablesDetail: [],
  filteredReceivablesDetail: [],
  receivablesDetailFiltersOptions: {
    cardBrands: [],
    paymentTypes: [],
    status: [],
    releaseTypes: []
  },
  receivablesCalendar: [],
  receivablesDetailExcelFile: null as any,
  receivablesCalendarExcelFile: null as any,
  adjustmentsDetail: [],
  adjustmentsCalendar: [],
  adjustmentsSummary: [],
  lastUpdateDate: null as any,
};
