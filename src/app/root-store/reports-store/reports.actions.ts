import { Action } from '@ngrx/store';
import { ReportRequest, RequestReport } from './reports.models';

export enum ActionTypes {
  SELECT_REQUESTS_REPORTS = '@app/reports/select-requests-reports',
  LOAD_REQUESTS_REPORTS = '@app/reports/load-requests-reports',
  REQUEST_REPORTS_SALES = '@app/reports/request-reports-sales',
  REQUEST_REPORTS_ALL_CARDS = '@app/reports/request-reports-all-card',
  REQUEST_REPORTS_RECEIVABLES = '@app/reports/request-reports-receivables',
  LOAD_REQUEST_REPORTS = '@app/reports/load-request-reports',
  SELECT_LAST_REQUEST_REPORTS = '@app/reports/select-last-request-reports',
  LOAD_LAST_REQUEST_REPORTS = '@app/reports/load-last-request-reports',
  SELECT_MOVEMENTS_SALES_REPORTS_EXCEL = '@app/reports/select-sales-reports-excel',
  LOAD_MOVEMENTS_SALES_REPORTS_EXCEL = '@app/reports/load-sales-reports-excel',
  SELECT_HISTORIC_SALES_REPORTS_EXCEL = '@app/reports/select-historic-sales-reports-excel',
  LOAD_HISTORIC_SALES_REPORTS_EXCEL = '@app/reports/load-historic-sales-reports-excel',
  SELECT_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL = '@app/reports/select-receivables-reports-excel',
  LOAD_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL = '@app/reports/load-receivables-reports-excel',
  SELECT_HISTORIC_RECEIVABLES_REPORTS_EXCEL = '@app/reports/select-historic-receivables-reports-excel',
  LOAD_HISTORIC_RECEIVABLES_REPORTS_EXCEL = '@app/reports/load-historic-receivables-reports-excel',
  DOWNLOADED_EXCEL_REPORTS = '@app/reports/downloaded-excel-reports',
  ON_UPDATE_REQUEST_REPORTS = '@app/reports/update-request-reports',
  GENERIC_ERROR = '[@app/reports/generic-error',
  SELECT_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL = '@app/reports/select-all-cards-reports-excel',
  LOAD_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL = '@app/reports/load-all-cards-reports-excel',
  SELECT_HISTORIC_ALL_CARDS_REPORTS_EXCEL = '@app/reports/select-historic-all-cards-reports-excel',
  LOAD_HISTORIC_ALL_CARDS_REPORTS_EXCEL = '@app/reports/load-historic-all-cards-reports-excel'
}

export class GenericErrorAction implements Action {
  readonly type = ActionTypes.GENERIC_ERROR;
  constructor(public payload: { error: any }) {}
}

export class SelectRequestsReportsAction implements Action {
  readonly type = ActionTypes.SELECT_REQUESTS_REPORTS;
  constructor() {}
}

export class LoadRequestsReportsAction implements Action {
  readonly type = ActionTypes.LOAD_REQUESTS_REPORTS;
  constructor(public payload: { result: ReportRequest[] }) {}
}

export class RequestReceivablesReportsAction implements Action {
  readonly type = ActionTypes.REQUEST_REPORTS_RECEIVABLES;
  constructor(public payload: { request: RequestReport }) {}
}

export class RequestSalesReportsAction implements Action {
  readonly type = ActionTypes.REQUEST_REPORTS_SALES;
  constructor(public payload: { request: RequestReport }) {}
}

export class RequestAllCardsReportsAction implements Action {
  readonly type = ActionTypes.REQUEST_REPORTS_ALL_CARDS;
  constructor(public payload: { request: RequestReport }) {}
}

export class LoadRequestReportsAction implements Action {
  readonly type = ActionTypes.LOAD_REQUEST_REPORTS;
  constructor(public payload: { result: ReportRequest }) {}
}

export class SelectLastRequestAction implements Action {
  readonly type = ActionTypes.SELECT_LAST_REQUEST_REPORTS;
  constructor() {}
}

export class LoadLastRequestAction implements Action {
  readonly type = ActionTypes.LOAD_LAST_REQUEST_REPORTS;
  constructor(public payload: { result: ReportRequest }) {}
}

export class SelectMovementsSalesReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_MOVEMENTS_SALES_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}

export class LoadMovementsSalesReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_MOVEMENTS_SALES_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export class SelectMovementsReceivablesReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}

export class LoadMovementsReceivablesReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export class SelectHistoricSalesReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_HISTORIC_SALES_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}
export class LoadHistoricSalesReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_HISTORIC_SALES_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export class SelectHistoricReceivablesReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_HISTORIC_RECEIVABLES_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}

export class LoadHistoricReceivablesReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_HISTORIC_RECEIVABLES_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export class DownloadedExcelReportsAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_EXCEL_REPORTS;
  constructor() {}
}

export class OnUpdateRequestReportsAction implements Action {
  readonly type = ActionTypes.ON_UPDATE_REQUEST_REPORTS;
  constructor(public payload: { result: ReportRequest }) {}
}

export class SelectMovementsAllCardsReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}

export class LoadMovementsAllCardsReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export class SelectHistoricAllCardsReportsExcelAction implements Action {
  readonly type = ActionTypes.SELECT_HISTORIC_ALL_CARDS_REPORTS_EXCEL;
  constructor(public payload: { id: number }) {}
}
export class LoadHistoricAllCardsReportsExcelAction implements Action {
  readonly type = ActionTypes.LOAD_HISTORIC_ALL_CARDS_REPORTS_EXCEL;
  constructor(public payload: { id: number; result: Blob; fileName: string }) {}
}

export type Actions =
  | SelectRequestsReportsAction
  | LoadRequestsReportsAction
  | RequestReceivablesReportsAction
  | RequestSalesReportsAction
  | LoadRequestReportsAction
  | SelectLastRequestAction
  | LoadLastRequestAction
  | SelectMovementsSalesReportsExcelAction
  | LoadMovementsSalesReportsExcelAction
  | SelectMovementsReceivablesReportsExcelAction
  | LoadMovementsReceivablesReportsExcelAction
  | SelectHistoricSalesReportsExcelAction
  | LoadHistoricSalesReportsExcelAction
  | SelectHistoricReceivablesReportsExcelAction
  | LoadHistoricReceivablesReportsExcelAction
  | DownloadedExcelReportsAction
  | OnUpdateRequestReportsAction
  | RequestAllCardsReportsAction
  | SelectMovementsAllCardsReportsExcelAction
  | LoadMovementsAllCardsReportsExcelAction
  | SelectHistoricAllCardsReportsExcelAction
  | LoadHistoricAllCardsReportsExcelAction;
