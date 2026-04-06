import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as AuthStoreSelectors from '../auth-store/auth.selectors';
import { AppState } from '../state';
import * as StatementsStoreActions from './statements.actions';
import { StatementsService } from './statements.service';

@Injectable()
export class StatementsStoreEffects {
  constructor(
    private statementsService: StatementsService,
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  loadStatementsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.SelectStatementsAction>(
          StatementsStoreActions.ActionTypes.SELECT_STATEMENTS,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postStatements(action.payload.uids)
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadStatementsAction({ result }),
              ),
            );
        }),
      ),
  );

  loadStatementsFileTxtEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.SelectStatementsFileTxtAction>(
          StatementsStoreActions.ActionTypes.SELECT_STATEMENTS_FILE_TXT,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postDownloadStatementsFileTxt(action.payload.fileName)
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadStatementsFileTxtAction({
                    result,
                  }),
              ),
            );
        }),
      ),
  );

  loadStatementsFileXmlEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.SelectStatementsFileXmlAction>(
          StatementsStoreActions.ActionTypes.SELECT_STATEMENTS_FILE_XML,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postDownloadStatementsFileXml(action.payload.fileName)
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadStatementsFileXmlAction({
                    result,
                  }),
              ),
            );
        }),
      ),
  );

  loadLastStatementsSchedulingEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.SelectLastStatementsSchedulingAction>(
          StatementsStoreActions.ActionTypes.SELECT_LAST_STATEMENTS_SCHEDULING,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postLastStatementsScheduling(action.payload.uids)
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadLastStatementSchedulingAction({
                    result,
                  }),
              ),
            );
        }),
      ),
  );

  addStatementsSchedulingEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.AddSchedulingStatementAction>(
          StatementsStoreActions.ActionTypes.ADD_SCHEDULING_STATEMENT,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postAddStatementsScheduling(action.payload.request, '') // auth.authData?.user?.id
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadAddSchedulingStatementAction({
                    result,
                  }),
              ),
            );
        }),
      ),
  );

  uploadStatementFileffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<StatementsStoreActions.UploadStatementFileValidateAction>(
          StatementsStoreActions.ActionTypes.UPLOAD_STATEMENT_FILE_VALIDATE,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.statementsService
            .postUploadFileStatementValidate(action.payload.fileToUpload)
            .pipe(
              map(
                (result) =>
                  new StatementsStoreActions.LoadUploadStatementFileValidateAction(
                    { result },
                  ),
              ),
            );
        }),
      ),
  );
}
