import { Action } from '@ngrx/store';
import {
  Adjustment,
  LastUpdateDateReceivables,
  Receivable,
  ReceivableCalendar,
  ReceivableDetail,
  SummaryCardReceivables
} from './receivables.models';
import { ReceivablesDetailFiltersOptions } from './receivables.state';

export enum ActionTypes {
  SELECT_PAST_RECEIVABLES = '@app/receivables/select-past-receivables',
  LOAD_PAST_RECEIVABLES = '@app/receivables/load-past-receivables',
  SELECT_RECEIVABLES_SUMMARY = '@app/receivables/select-receivables-summary',
  LOAD_RECEIVABLES_SUMMARY = '@app/receivables/load-receivables-summary',
  SELECT_RECEIVABLES_DETAIL = '@app/receivables/select-receivables-detail',
  LOAD_RECEIVABLES_DETAIL = '@app/receivables/load-receivables-detail',
  SELECT_RECEIVABLES_DETAIL_EXCEL = '@app/receivables/select-receivables-detail-excel',
  LOAD_RECEIVABLES_DETAIL_EXCEL = '@app/receivables/load-receivables-detail-excel',
  DOWNLOADED_RECEIVABLES_DETAIL_EXCEL = '@app/receivables/downloaded-receivables-detail-excel',
  SELECT_RECEIVABLES_CALENDAR_EXCEL = '@app/receivables/select-receivables-calendar-excel',
  LOAD_RECEIVABLES_CALENDAR_EXCEL = '@app/receivables/load-receivables-calendar-excel',
  DOWNLOADED_RECEIVABLES_CALENDAR_EXCEL = '@app/receivables/downloaded-receivables-calendar-excel',
  SELECT_RECEIVABLES_CALENDAR = '@app/receivables/select-receivables-calendar',
  LOAD_RECEIVABLES_CALENDAR = '@app/receivables/load-receivables-calendar',
  SELECT_ADJUSTMENTS_CALENDAR = '@app/receivables/select-adjustments-calendar',
  LOAD_ADJUSTMENTS_CALENDAR = '@app/receivables/load-adjustments-calendar',
  SELECT_ADJUSTMENTS_DETAIL = '@app/receivables/select-adjustments-detail',
  LOAD_ADJUSTMENTS_DETAIL = '@app/receivables/load-adjustments-detail',
  SELECT_ADJUSTMENTS_SUMMARY = '@app/receivables/select-adjustments-summary',
  LOAD_ADJUSTMENTS_SUMMARY = '@app/receivables/load-adjustments-summary',
  FILTER_RECEIVABLES_DETAILS = '@app/receivables/filter-receivables-details',
  GENERIC_ERROR = '@app/receivables/generic-error',
  SELECT_LAST_UPDATE_DATE_RECEIVABLES = '@app/receivables/select-last-update-date-receivables',
  LOAD_LAST_UPDATE_DATE_RECEIVABLES = '@app/receivables/load-last-update-date-receivables',
}

export class GenericErrorAction implements Action {
  readonly type = ActionTypes.GENERIC_ERROR;
  constructor(public payload: { error: any }) { }
}

export class SelectPastReceivablesAction implements Action {
  readonly type = ActionTypes.SELECT_PAST_RECEIVABLES;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadPastReceivablesAction implements Action {
  readonly type = ActionTypes.LOAD_PAST_RECEIVABLES;
  constructor(public payload: { result: Receivable[] }) { }
}

export class SelectReceivablesSummaryAction implements Action {
  readonly type = ActionTypes.SELECT_RECEIVABLES_SUMMARY;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadReceivablesSummaryAction implements Action {
  readonly type = ActionTypes.LOAD_RECEIVABLES_SUMMARY;
  constructor(public payload: { result: SummaryCardReceivables }) { }
}

export class SelectReceivablesDetailAction implements Action {
  readonly type = ActionTypes.SELECT_RECEIVABLES_DETAIL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadReceivablesDetailAction implements Action {
  readonly type = ActionTypes.LOAD_RECEIVABLES_DETAIL;
  constructor(public payload: { result: ReceivableDetail[] }) { }
}

export class SelectReceivablesDetailExcelAction implements Action {
  readonly type = ActionTypes.SELECT_RECEIVABLES_DETAIL_EXCEL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
    dates?: Date[];
  }) { }
}

export class LoadReceivablesDetailExcelAction implements Action {
  readonly type = ActionTypes.LOAD_RECEIVABLES_DETAIL_EXCEL;
  constructor(public payload: { result: any }) { }
}

export class DownloadedReceivablesDetailExcelAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_RECEIVABLES_DETAIL_EXCEL;
}

export class SelectReceivablesCalendarExcelAction implements Action {
  readonly type = ActionTypes.SELECT_RECEIVABLES_CALENDAR_EXCEL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
    dates: Date[]
  }) { }
}

export class LoadReceivablesCalendarExcelAction implements Action {
  readonly type = ActionTypes.LOAD_RECEIVABLES_CALENDAR_EXCEL;
  constructor(public payload: { result: any }) { }
}

export class DownloadedReceivablesCalendarExcelAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_RECEIVABLES_CALENDAR_EXCEL;
}

export class SelectReceivablesCalendarAction implements Action {
  readonly type = ActionTypes.SELECT_RECEIVABLES_CALENDAR;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadReceivablesCalendarAction implements Action {
  readonly type = ActionTypes.LOAD_RECEIVABLES_CALENDAR;
  constructor(public payload: { result: ReceivableCalendar[] }) { }
}

export class SelectAdjustmentsCalendarAction implements Action {
  readonly type = ActionTypes.SELECT_ADJUSTMENTS_CALENDAR;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadAdjustmentsCalendarAction implements Action {
  readonly type = ActionTypes.LOAD_ADJUSTMENTS_CALENDAR;
  constructor(public payload: { result: Adjustment[] }) { }
}

export class SelectAdjustmentsDetailAction implements Action {
  readonly type = ActionTypes.SELECT_ADJUSTMENTS_DETAIL;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadAdjustmentsDetailAction implements Action {
  readonly type = ActionTypes.LOAD_ADJUSTMENTS_DETAIL;
  constructor(public payload: { result: Adjustment[] }) { }
}

export class SelectAdjustmentsSummaryAction implements Action {
  readonly type = ActionTypes.SELECT_ADJUSTMENTS_SUMMARY;
  constructor(public payload: {
    initialDate: string;
    finalDate: string;
    uids: string[];
  }) { }
}

export class LoadAdjustmentsSummaryAction implements Action {
  readonly type = ActionTypes.LOAD_ADJUSTMENTS_SUMMARY;
  constructor(public payload: { result: Adjustment[] }) { }
}

export class FilterReceivablesDetailsAction implements Action {
  readonly type = ActionTypes.FILTER_RECEIVABLES_DETAILS;
  constructor(public payload: { filter: ReceivablesDetailFiltersOptions }) { }
}

export class SelectLastUpdateDateReceivablesAction implements Action {
  readonly type = ActionTypes.SELECT_LAST_UPDATE_DATE_RECEIVABLES;
}

export class LoadLastUpdateDateReceivablesAction implements Action {
  readonly type = ActionTypes.LOAD_LAST_UPDATE_DATE_RECEIVABLES;
  constructor(public payload: { result: LastUpdateDateReceivables }) { }
}

export type Actions = SelectPastReceivablesAction
  | LoadPastReceivablesAction
  | SelectReceivablesSummaryAction
  | LoadReceivablesSummaryAction
  | SelectReceivablesDetailAction
  | LoadReceivablesDetailAction
  | SelectReceivablesDetailExcelAction
  | LoadReceivablesDetailExcelAction
  | DownloadedReceivablesDetailExcelAction
  | SelectReceivablesCalendarExcelAction
  | LoadReceivablesCalendarExcelAction
  | DownloadedReceivablesCalendarExcelAction
  | SelectReceivablesCalendarAction
  | LoadReceivablesCalendarAction
  | SelectAdjustmentsCalendarAction
  | LoadAdjustmentsCalendarAction
  | SelectAdjustmentsDetailAction
  | LoadAdjustmentsDetailAction
  | SelectAdjustmentsSummaryAction
  | LoadAdjustmentsSummaryAction
  | FilterReceivablesDetailsAction
  | SelectLastUpdateDateReceivablesAction
  | LoadLastUpdateDateReceivablesAction;
