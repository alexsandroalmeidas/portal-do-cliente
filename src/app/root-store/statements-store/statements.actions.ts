import { Action } from '@ngrx/store';
import { Statement, StatementScheduling, StatementSchedulingRequest } from './statements.models';

export enum ActionTypes {
  SELECT_STATEMENTS = '@app/statements/select-statements',
  LOAD_STATEMENTS = '@app/statements/load-statements',
  SELECT_STATEMENTS_FILE_TXT = '@app/statements/select-statement-file-txt',
  LOAD_STATEMENTS_FILE_TXT = '@app/statements/load-statement-file-txt',
  DOWNLOADED_STATEMENTS_FILE_TXT = '@app/statements/downloaded-statement-file-txt',
  SELECT_STATEMENTS_FILE_XML = '@app/statements/select-statement-file-xml',
  LOAD_STATEMENTS_FILE_XML = '@app/statements/load-statement-file-xml',
  DOWNLOADED_STATEMENTS_FILE_XML = '@app/statements/downloaded-statement-file-xml',
  SELECT_LAST_STATEMENTS_SCHEDULING = '@app/statements/select-last-statements-scheduling',
  LOAD_LAST_STATEMENTS_SCHEDULING = '@app/statements/load-last-statements-scheduling',
  ADD_SCHEDULING_STATEMENT = '@app/statements/add-scheduling-statement',
  LOAD_ADD_SCHEDULING_STATEMENT = '@app/statements/load-add-scheduling-statement',
  ADDED_SCHEDULING_STATEMENT = '@app/statements/added-scheduling-statement',
  UPLOAD_STATEMENT_FILE_VALIDATE = '@app/statements/upload-statement-file',
  LOAD_UPLOAD_STATEMENT_FILE_VALIDATE = '@app/statements/upload-statement-api',
  DOWNLOAD_STATEMENT_FILE_VALIDATE = '@app/statements/downloaded-statement-api'
}

export class SelectStatementsAction implements Action {
  readonly type = ActionTypes.SELECT_STATEMENTS;
  constructor(public payload: { uids: string[]; }) { }
}

export class LoadStatementsAction implements Action {
  readonly type = ActionTypes.LOAD_STATEMENTS;
  constructor(public payload: { result: Statement[] }) { }
}

export class SelectStatementsFileTxtAction implements Action {
  readonly type = ActionTypes.SELECT_STATEMENTS_FILE_TXT;
  constructor(public payload: { fileName: string }) { }
}

export class LoadStatementsFileTxtAction implements Action {
  readonly type = ActionTypes.LOAD_STATEMENTS_FILE_TXT;
  constructor(public payload: { result: any }) { }
}

export class DownloadedStatementsFileTxtAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_STATEMENTS_FILE_TXT;
  constructor() { }
}

export class SelectStatementsFileXmlAction implements Action {
  readonly type = ActionTypes.SELECT_STATEMENTS_FILE_XML;
  constructor(public payload: { fileName: string }) { }
}

export class LoadStatementsFileXmlAction implements Action {
  readonly type = ActionTypes.LOAD_STATEMENTS_FILE_XML;
  constructor(public payload: { result: any }) { }
}

export class DownloadedStatementsFileXmlAction implements Action {
  readonly type = ActionTypes.DOWNLOADED_STATEMENTS_FILE_XML;
  constructor() { }
}

export class SelectLastStatementsSchedulingAction implements Action {
  readonly type = ActionTypes.SELECT_LAST_STATEMENTS_SCHEDULING;
  constructor(public payload: { uids: string[]; }) { }
}

export class LoadLastStatementSchedulingAction implements Action {
  readonly type = ActionTypes.LOAD_LAST_STATEMENTS_SCHEDULING;
  constructor(public payload: { result: StatementScheduling[] }) { }
}

export class AddSchedulingStatementAction implements Action {
  readonly type = ActionTypes.ADD_SCHEDULING_STATEMENT;
  constructor(public payload: { request: StatementSchedulingRequest }) { }
}

export class LoadAddSchedulingStatementAction implements Action {
  readonly type = ActionTypes.LOAD_ADD_SCHEDULING_STATEMENT;
  constructor(public payload: { result: StatementScheduling }) { }
}

export class AddedSchedulingStatementAction implements Action {
  readonly type = ActionTypes.ADDED_SCHEDULING_STATEMENT;
  constructor() { }
}

export class UploadStatementFileValidateAction implements Action {
  readonly type = ActionTypes.UPLOAD_STATEMENT_FILE_VALIDATE;
  constructor(public payload: { fileToUpload: File }) { }
}

export class LoadUploadStatementFileValidateAction implements Action {
  readonly type = ActionTypes.LOAD_UPLOAD_STATEMENT_FILE_VALIDATE;
  constructor(public payload: { result: any }) { }
}

export class DownloadedStatementFileValidateExcelAction implements Action {
  readonly type = ActionTypes.DOWNLOAD_STATEMENT_FILE_VALIDATE;
  constructor() { }
}

export type Actions = SelectStatementsAction
  | LoadStatementsAction
  | SelectStatementsFileTxtAction
  | LoadStatementsFileTxtAction
  | DownloadedStatementsFileTxtAction
  | SelectStatementsFileXmlAction
  | LoadStatementsFileXmlAction
  | DownloadedStatementsFileXmlAction
  | SelectLastStatementsSchedulingAction
  | AddedSchedulingStatementAction
  | LoadLastStatementSchedulingAction
  | AddSchedulingStatementAction
  | LoadAddSchedulingStatementAction
  | UploadStatementFileValidateAction
  | LoadUploadStatementFileValidateAction
  | DownloadedStatementFileValidateExcelAction;
