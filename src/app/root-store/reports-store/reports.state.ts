import { ReportRequest } from './reports.models';

export interface ReportsState {
  requests: ReportRequest[];
  lastRequest: ReportRequest;
  salesMovementsExcel: Blob;
  salesMovementsExcelName: string;
  allCardsMovementsExcel: Blob;
  allCardsMovementsExcelName: string;
  salesHistoricExcel: Blob;
  salesHistoricExcelName: string;
  allCardsHistoricExcel: Blob;
  allCardsHistoricExcelName: string;
  receivablesMovementsExcel: Blob;
  receivablesMovementsExcelName: string;
  receivablesHistoricExcel: Blob;
  receivablesHistoricExcelName: string;
}

export const initialState: ReportsState = {
  requests: [],
  lastRequest: null as any,
  salesMovementsExcel: null as any,
  salesMovementsExcelName: null as any,
  allCardsMovementsExcel: null as any,
  allCardsMovementsExcelName: null as any,
  salesHistoricExcel: null as any,
  salesHistoricExcelName: null as any,
  allCardsHistoricExcel: null as any,
  allCardsHistoricExcelName: null as any,
  receivablesMovementsExcel: null as any,
  receivablesMovementsExcelName: null as any,
  receivablesHistoricExcel: null as any,
  receivablesHistoricExcelName: null as any
};
