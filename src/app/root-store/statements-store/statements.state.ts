import { Statement, StatementScheduling } from './statements.models';

export interface StatementsState {
  isLoading?: boolean;
  error?: any;

  statements: Statement[];
  statementsFileTxt: Blob;
  statementsFileXml: Blob;
  statementsFileExcel: Blob;
  lastStatementsScheduling: StatementScheduling[];
  statementsScheduling: StatementScheduling;
}

export const initialState: StatementsState = {
  isLoading: false,
  error: null,
  statements: [],
  statementsFileTxt: null as any,
  statementsFileXml: null as any,
  statementsFileExcel: null as any,
  lastStatementsScheduling: [],
  statementsScheduling: null as any,
};
