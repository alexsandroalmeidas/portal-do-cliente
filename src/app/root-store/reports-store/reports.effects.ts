import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as AuthStoreSelectors from '../auth-store/auth.selectors';
import { AppState } from '../state';
import * as ReportsStoreActions from './reports.actions';
import { ReportsService } from './reports.service';

@Injectable()
export class ReportsStoreEffects {
  constructor(
    private reportsService: ReportsService,
    private store$: Store<AppState>,
    private actions$: Actions,
  ) {}

  loadRequestReportsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectRequestsReportsAction>(
          ReportsStoreActions.ActionTypes.SELECT_REQUESTS_REPORTS,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([, auth]) => {
          return this.reportsService
            .getRequestsReports('') // auth.authData?.user?.id
            .pipe(
              map(
                (result) =>
                  new ReportsStoreActions.LoadRequestsReportsAction({ result }),
              ),
            );
        }),
      ),
  );

  loadLastRequestReportsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectLastRequestAction>(
          ReportsStoreActions.ActionTypes.SELECT_LAST_REQUEST_REPORTS,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([, auth]) => {
          return this.reportsService
            .getLastRequestReports('') // auth.authData?.user?.id
            .pipe(
              map(
                (result) =>
                  new ReportsStoreActions.LoadLastRequestAction({ result }),
              ),
            );
        }),
      ),
  );

  requestSalesReportsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.RequestSalesReportsAction>(
          ReportsStoreActions.ActionTypes.REQUEST_REPORTS_SALES,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .postRequestSalesReports(
              action.payload.request,
              '', // auth.authData?.user?.id,
            )
            .pipe(
              map((result) => {
                return new ReportsStoreActions.LoadRequestReportsAction({
                  result,
                });
              }),
            );
        }),
      ),
  );

  requestAllCardsReportsEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.RequestAllCardsReportsAction>(
          ReportsStoreActions.ActionTypes.REQUEST_REPORTS_ALL_CARDS,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .postRequestAllCardsReports(
              action.payload.request,
              '', // auth.authData?.user?.id,
            )
            .pipe(
              map((result) => {
                return new ReportsStoreActions.LoadRequestReportsAction({
                  result,
                });
              }),
            );
        }),
      ),
  );

  requestReportsReceivablesEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.RequestReceivablesReportsAction>(
          ReportsStoreActions.ActionTypes.REQUEST_REPORTS_RECEIVABLES,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .postRequestReceivablesReports(action.payload.request, '') // auth.authData?.user?.id
            .pipe(
              map((result) => {
                return new ReportsStoreActions.LoadRequestReportsAction({
                  result,
                });
              }),
            );
        }),
      ),
  );

  selectMovementsSalesReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectMovementsSalesReportsExcelAction>(
          ReportsStoreActions.ActionTypes.SELECT_MOVEMENTS_SALES_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadSalesReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadMovementsSalesReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );

  selectMovementsAllCardsReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectMovementsAllCardsReportsExcelAction>(
          ReportsStoreActions.ActionTypes
            .SELECT_MOVEMENTS_ALL_CARDS_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadAllCardsReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadMovementsAllCardsReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );

  private extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      console.warn('Content-Disposition não encontrado!');
      return null;
    }

    // Tente primeiro extrair o "filename*=" (UTF-8)
    let matches = /filename\*\s*=\s*UTF-8''(.+?)(?:;|$)/.exec(
      contentDisposition,
    );
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]); // Decodifica caracteres UTF-8
    }

    // Se falhar, tente extrair o "filename="
    matches = /filename="(.+?)"/.exec(contentDisposition);
    if (matches && matches[1]) {
      return matches[1];
    }

    // Se ainda falhar, extraia o "filename=" sem aspas
    matches = /filename=([^;]+)/.exec(contentDisposition);
    if (matches && matches[1]) {
      return matches[1].trim();
    }

    console.warn('Nome do arquivo não encontrado no Content-Disposition!');
    return null;
  }

  selectMovementsReceivablesReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectMovementsReceivablesReportsExcelAction>(
          ReportsStoreActions.ActionTypes
            .SELECT_MOVEMENTS_RECEIVABLES_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadReceivablesReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadMovementsReceivablesReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );

  selectHistoricSalesReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectHistoricSalesReportsExcelAction>(
          ReportsStoreActions.ActionTypes.SELECT_HISTORIC_SALES_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadSalesReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadHistoricSalesReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );

  selectHistoricAllCardsReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectHistoricAllCardsReportsExcelAction>(
          ReportsStoreActions.ActionTypes
            .SELECT_HISTORIC_ALL_CARDS_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadAllCardsReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadHistoricAllCardsReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );

  selectHistoricReceivablesReportsExcelEffect$ = createEffect(
    () => () =>
      this.actions$.pipe(
        ofType<ReportsStoreActions.SelectHistoricReceivablesReportsExcelAction>(
          ReportsStoreActions.ActionTypes
            .SELECT_HISTORIC_RECEIVABLES_REPORTS_EXCEL,
        ),
        withLatestFrom(
          this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        ),
        switchMap(([action, auth]) => {
          return this.reportsService
            .downloadReceivablesReportExcel(action.payload.id)
            .pipe(
              map((response) => {
                const fileName =
                  this.extractFilename(
                    response.headers.get('Content-Disposition'),
                  ) ?? '';

                return new ReportsStoreActions.LoadHistoricReceivablesReportsExcelAction(
                  {
                    id: action.payload.id,
                    result: response.body,
                    fileName,
                  },
                );
              }),
            );
        }),
      ),
  );
}
