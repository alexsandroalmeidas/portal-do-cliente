import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ReportsStoreActions from './reports.actions';
import * as AuthStoreSelectors from '../auth-store/auth.selectors';
import { AppState } from '../state';

import {
  filterReports,
  buildSalesExcel,
  buildReceivablesExcel,
  buildAllCardsExcel,
  mockReportsDatabase,
} from './reports.mock';

import { ReportRequest } from './reports.models';

@Injectable()
export class ReportsStoreEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  /* =========================
     HELPERS
  ========================= */

  private createRequest(request: any): ReportRequest {
    return {
      id: Date.now(),

      requested: new Date(),
      executed: new Date(),
      requestedBy: 'mock@user.com',

      status: 1,
      progressStatus: 'Processando',
      progressValue: 50,

      movementType: 1,
      movementTypeDescription: 'Vendas',

      initialDate: new Date(request.initialDate),
      finalDate: new Date(request.finalDate),

      documents: request.uids?.[0] ?? '',
      equipments: 'POS',

      grossValue: 5000 + Math.random() * 5000,
      netValue: 4000 + Math.random() * 4000,
      qtdSales: Math.floor(Math.random() * 50),
    };
  }

  /* =========================
     LOAD REQUESTS
  ========================= */

  loadRequestReportsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsStoreActions.ActionTypes.SELECT_REQUESTS_REPORTS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
      ),
      switchMap(([_, auth]) => {
        const result = filterReports([]);

        return of(result).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadRequestsReportsAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     LAST REQUEST
  ========================= */

  loadLastRequestReportsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsStoreActions.ActionTypes.SELECT_LAST_REQUEST_REPORTS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
      ),
      switchMap(([_, auth]) => {
        const list = filterReports([]);
        const result = list[0];

        return of(result).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadLastRequestAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     REQUEST SALES
  ========================= */

  requestSalesReportsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsStoreActions.ActionTypes.REQUEST_REPORTS_SALES),
      switchMap((action: any) => {
        const result = this.createRequest(action.payload.request);

        return of(result).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadRequestReportsAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     REQUEST RECEIVABLES
  ========================= */

  requestReportsReceivablesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsStoreActions.ActionTypes.REQUEST_REPORTS_RECEIVABLES),
      switchMap((action: any) => {
        const result = this.createRequest(action.payload.request);

        return of(result).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadRequestReportsAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     REQUEST ALL CARDS
  ========================= */

  requestAllCardsReportsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportsStoreActions.ActionTypes.REQUEST_REPORTS_ALL_CARDS),
      switchMap((action: any) => {
        const result = this.createRequest(action.payload.request);

        return of(result).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadRequestReportsAction({ result }),
          ),
        );
      }),
    ),
  );

  /* =========================
     SALES EXCEL
  ========================= */

  selectMovementsSalesReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes.SELECT_MOVEMENTS_SALES_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildSalesExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadMovementsSalesReportsExcelAction({
                id: action.payload.id,
                result,
                fileName: `sales_${action.payload.id}.xlsx`,
              }),
          ),
        );
      }),
    ),
  );

  /* =========================
     RECEIVABLES EXCEL
  ========================= */

  selectMovementsReceivablesReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes
          .SELECT_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildReceivablesExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadMovementsReceivablesReportsExcelAction(
                {
                  id: action.payload.id,
                  result,
                  fileName: `receivables_${action.payload.id}.xlsx`,
                },
              ),
          ),
        );
      }),
    ),
  );

  /* =========================
     ALL CARDS EXCEL
  ========================= */

  selectMovementsAllCardsReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes
          .SELECT_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildAllCardsExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadMovementsAllCardsReportsExcelAction({
                id: action.payload.id,
                result,
                fileName: `allcards_${action.payload.id}.xlsx`,
              }),
          ),
        );
      }),
    ),
  );

  /* =========================
     HISTORIC SALES
  ========================= */

  selectHistoricSalesReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes.SELECT_HISTORIC_SALES_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildSalesExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadHistoricSalesReportsExcelAction({
                id: action.payload.id,
                result,
                fileName: `sales_historic_${action.payload.id}.xlsx`,
              }),
          ),
        );
      }),
    ),
  );

  /* =========================
     HISTORIC RECEIVABLES
  ========================= */

  selectHistoricReceivablesReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes
          .SELECT_HISTORIC_RECEIVABLES_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildReceivablesExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadHistoricReceivablesReportsExcelAction(
                {
                  id: action.payload.id,
                  result,
                  fileName: `receivables_historic_${action.payload.id}.xlsx`,
                },
              ),
          ),
        );
      }),
    ),
  );

  /* =========================
     HISTORIC ALL CARDS
  ========================= */

  selectHistoricAllCardsReportsExcelEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ReportsStoreActions.ActionTypes.SELECT_HISTORIC_ALL_CARDS_REPORTS_EXCEL,
      ),
      switchMap((action: any) => {
        const blob = buildAllCardsExcel(action.payload.id);

        return of(blob).pipe(
          map(
            (result) =>
              new ReportsStoreActions.LoadHistoricAllCardsReportsExcelAction({
                id: action.payload.id,
                result,
                fileName: `allcards_historic_${action.payload.id}.xlsx`,
              }),
          ),
        );
      }),
    ),
  );
}
