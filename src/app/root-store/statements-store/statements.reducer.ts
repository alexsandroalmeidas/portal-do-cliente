import { Actions, ActionTypes } from './statements.actions';
import { initialState, StatementsState } from './statements.state';

export function featureReducer(
  state = initialState,
  action: Actions
): StatementsState {
  switch (action.type) {
    case ActionTypes.SELECT_STATEMENTS: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_STATEMENTS: {
      const { result: statements } = action.payload;

      return {
        ...state,
        statements: statements || [],
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.SELECT_STATEMENTS_FILE_TXT: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_STATEMENTS_FILE_TXT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        statementsFileTxt: action.payload.result,
      };
    }
    case ActionTypes.DOWNLOADED_STATEMENTS_FILE_TXT: {
      return {
        ...state,
        statementsFileTxt: null as any
      };
    }
    case ActionTypes.SELECT_STATEMENTS_FILE_XML: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_STATEMENTS_FILE_XML: {
      return {
        ...state,
        isLoading: false,
        error: null,
        statementsFileXml: action.payload.result,
      };
    }
    case ActionTypes.DOWNLOADED_STATEMENTS_FILE_XML: {
      return {
        ...state,
        statementsFileXml: null as any
      };
    }
    case ActionTypes.SELECT_LAST_STATEMENTS_SCHEDULING: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_LAST_STATEMENTS_SCHEDULING: {
      return {
        ...state,
        isLoading: false,
        error: null,
        lastStatementsScheduling: action.payload.result,
      };
    }
    case ActionTypes.ADD_SCHEDULING_STATEMENT: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case ActionTypes.LOAD_ADD_SCHEDULING_STATEMENT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        statementsScheduling: action.payload.result,
      };
    }
    case ActionTypes.ADDED_SCHEDULING_STATEMENT: {
      return {
        ...state,
        isLoading: false,
        error: null,
        statementsScheduling: null as any,
      };
    }
    case ActionTypes.LOAD_UPLOAD_STATEMENT_FILE_VALIDATE: {
      return {
        ...state,
        isLoading: false,
        error: null,
        statementsFileExcel: action.payload.result,
      };
    }
    case ActionTypes.DOWNLOAD_STATEMENT_FILE_VALIDATE: {
      return {
        ...state,
        statementsFileExcel: null as any,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
