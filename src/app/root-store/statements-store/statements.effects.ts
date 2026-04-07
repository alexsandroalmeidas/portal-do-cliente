import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthStoreSelectors from '../auth-store/auth.selectors';
import { AppState } from '../state';
import * as StatementsStoreActions from './statements.actions';

import {
  getStatements,
  getLastScheduling,
  getFileTxt,
  getFileXml,
  validateUpload,
} from './statements.mock';

@Injectable()
export class StatementsStoreEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  /* =========================
     STATEMENTS
  ========================= */
  loadStatementsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<StatementsStoreActions.SelectStatementsAction>(
        StatementsStoreActions.ActionTypes.SELECT_STATEMENTS,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
      ),
      switchMap(([action]) => {
        const result = getStatements(action.payload.uids);

        return of(result).pipe(
          map(
            (result) =>
              new StatementsStoreActions.LoadStatementsAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     FILE TXT
  ========================= */
  loadStatementsFileTxtEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatementsStoreActions.ActionTypes.SELECT_STATEMENTS_FILE_TXT),
      switchMap((action: any) => {
        const result = getFileTxt(action.payload.fileName);

        return of(result).pipe(
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

  /* =========================
     FILE XML
  ========================= */
  loadStatementsFileXmlEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatementsStoreActions.ActionTypes.SELECT_STATEMENTS_FILE_XML),
      switchMap((action: any) => {
        const result = getFileXml(action.payload.fileName);

        return of(result).pipe(
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

  /* =========================
     LAST SCHEDULING
  ========================= */
  loadLastStatementsSchedulingEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        StatementsStoreActions.ActionTypes.SELECT_LAST_STATEMENTS_SCHEDULING,
      ),
      switchMap((action: any) => {
        const result = getLastScheduling(action.payload.uids);

        return of(result).pipe(
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

  /* =========================
     ADD SCHEDULING
  ========================= */
  addStatementsSchedulingEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatementsStoreActions.ActionTypes.ADD_SCHEDULING_STATEMENT),
      switchMap((action: any) => {
        const request = action.payload.request;

        const result = {
          documentNumber: '12345678000199',
          createdDate: new Date(),
          initialDate: new Date(request.initialDate),
          finalDate: new Date(request.finalDate),
        };

        return of(result).pipe(
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

  /* =========================
     UPLOAD VALIDATE
  ========================= */
  uploadStatementFileffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatementsStoreActions.ActionTypes.UPLOAD_STATEMENT_FILE_VALIDATE),
      switchMap(() => {
        const result = validateUpload();

        return of(result).pipe(
          map(
            (result) =>
              new StatementsStoreActions.LoadUploadStatementFileValidateAction({
                result,
              }),
          ),
        );
      }),
    ),
  );
}
