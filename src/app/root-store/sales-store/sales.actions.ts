import { Action } from '@ngrx/store';
import { LastUpdateDateSales, SalesCalendar, SalesDetail, SalesDetailFiltersOptions, SummaryCardSales, SummaryLastSales } from './sales.models';

export enum ActionTypes {
  SELECT_SUMMARY_CARD_SALES = '@app/sales/select-summary-card-sales',
  LOAD_SUMMARY_CARD_SALES = '@app/sales/load-summary-card-sales',
  LOAD_SUMMARY_CARD_SALES_FAILURE = '@app/sales/load-summary-card-sales-failure',
  SELECT_SALES_DETAIL = '@app/sales/select-sales-detail',
  LOAD_SALES_DETAIL = '@app/sales/load-sales-detail',
  SELECT_SALES_DETAIL_EXCEL = '@app/sales/select-sales-detail-excel',
  LOAD_SALES_DETAIL_EXCEL = '@app/sales/load-sales-detail-excel',
  DOWNLOADED_SALES_DETAIL_EXCEL = '@app/sales/downloaded-sales-detail-excel',
  SELECT_SALES_CALENDAR_EXCEL = '@app/sales/select-sales-calendar-excel',
  LOAD_SALES_CALENDAR_EXCEL = '@app/sales/load-sales-calendar-excel',
  DOWNLOADED_SALES_CALENDAR_EXCEL = '@app/sales/downloaded-sales-calendar-excel',
  SELECT_SALES_CALENDAR = '@app/sales/select-sales-calendar',
  LOAD_SALES_CALENDAR = '@app/sales/load-sales-calendar',
  LOAD_SALES_CALENDAR_FAILURE = '@app/sales/load-sales-calendar-failure',
  SELECT_LAST_UPDATE_DATE_SALES = '@app/sales/select-last-update-date-sales',
  LOAD_LAST_UPDATE_DATE_SALES = '@app/sales/load-last-update-date-salse',
  SELECT_LAST_SALES_SUMMARY = '@app/sales/select-last-sales-summary',
  LOAD_LAST_SALES_SUMMARY = '@app/sales/load-last-sales-summary',
  FILTER_SALES_DETAILS = '@app/sales/filter-sales-details',
  GENERIC_ERROR = '@app/sales/generic-error'
}

export class GenericErrorAction implements Action {
  readonly type = ActionTypes.GENERIC_ERROR;
  constructor(public payload: { error: any }) { }
}

export class SelectSummaryCardSalesAction implements Action {
  readonly type = ActionTypes.SELECT_SUMMARY_CARD_SALES;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadSalesSummaryAction implements Action {
  readonly type = ActionTypes.LOAD_SUMMARY_CARD_SALES;
  constructor(public payload: { result: SummaryCardSales }) { }
}

export class LoadSalesSummaryFailureAction implements Action {
  readonly type = ActionTypes.LOAD_SUMMARY_CARD_SALES_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class SelectSalesDetailAction implements Action {
  readonly type = ActionTypes.SELECT_SALES_DETAIL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadSalesDetailAction implements Action {
  readonly type = ActionTypes.LOAD_SALES_DETAIL;
  constructor(public payload: { result: SalesDetail[] }) { }
}

export class SelectSalesDetailExcelAction implements Action {
  readonly type = ActionTypes.SELECT_SALES_DETAIL_EXCEL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
    dates?: Date[];
  }) { }
}

export class LoadSalesDetailExcelAction implements Action {
  readonly type = ActionTypes.LOAD_SALES_DETAIL_EXCEL;
  constructor(public payload: { result: any }) { }
}

export class DownloadedSalesDetailExcelAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_SALES_DETAIL_EXCEL;
}

export class SelectSalesCalendarExcelAction implements Action {
  readonly type = ActionTypes.SELECT_SALES_CALENDAR_EXCEL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
    dates: Date[]
  }) { }
}

export class LoadSalesCalendarExcelAction implements Action {
  readonly type = ActionTypes.LOAD_SALES_CALENDAR_EXCEL;
  constructor(public payload: { result: any }) { }
}

export class DownloadedSalesCalendarExcelAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_SALES_CALENDAR_EXCEL;
}

export class SelectSalesCalendarAction implements Action {
  readonly type = ActionTypes.SELECT_SALES_CALENDAR;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadSalesCalendarAction implements Action {
  readonly type = ActionTypes.LOAD_SALES_CALENDAR;
  constructor(public payload: { result: SalesCalendar[] }) { }
}

export class LoadSalesCalendarFailureAction implements Action {
  readonly type = ActionTypes.LOAD_SALES_CALENDAR_FAILURE;
  constructor(public payload: { error: any }) { }
}

export class SelectLastUpdateDateSalesAction implements Action {
  readonly type = ActionTypes.SELECT_LAST_UPDATE_DATE_SALES;
}

export class LoadLastUpdateDateSalesAction implements Action {
  readonly type = ActionTypes.LOAD_LAST_UPDATE_DATE_SALES;
  constructor(public payload: { result: LastUpdateDateSales }) { }
}

export class SelectLastSalesSummaryAction implements Action {
  readonly type = ActionTypes.SELECT_LAST_SALES_SUMMARY;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadLastSalesSummaryAction implements Action {
  readonly type = ActionTypes.LOAD_LAST_SALES_SUMMARY;
  constructor(public payload: { result: SummaryLastSales[] }) { }
}

export class FilterSalesDetailsAction implements Action {
  readonly type = ActionTypes.FILTER_SALES_DETAILS;
  constructor(public payload: { filter: SalesDetailFiltersOptions }) { }
}

export type Actions =
  | GenericErrorAction
  | SelectSummaryCardSalesAction
  | LoadSalesSummaryAction
  | LoadSalesSummaryFailureAction
  | SelectSalesDetailAction
  | LoadSalesDetailAction
  | SelectSalesDetailExcelAction
  | LoadSalesDetailExcelAction
  | DownloadedSalesDetailExcelAction
  | SelectSalesCalendarExcelAction
  | LoadSalesCalendarExcelAction
  | DownloadedSalesCalendarExcelAction
  | SelectSalesCalendarAction
  | LoadSalesCalendarAction
  | LoadSalesCalendarFailureAction
  | SelectLastUpdateDateSalesAction
  | LoadLastUpdateDateSalesAction
  | SelectLastSalesSummaryAction
  | LoadLastSalesSummaryAction
  | FilterSalesDetailsAction;
