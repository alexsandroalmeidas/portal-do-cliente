import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { PrepaymentsStoreActions } from '.';

import {
  buildSchedule,
  buildGrouping,
  buildRate,
  buildAuthorization,
  buildFinalizePunctual,
  buildFinalizeScheduled,
  buildCancelScheduled,
  buildHistoric,
  buildAccreditations,
  buildScheduledFinalized, // ✅ NOVO
} from './prepayments.mock';

@Injectable()
export class PrepaymentsStoreEffects {
  constructor(private actions$: Actions) {}

  /* =========================
     GROUPING (FIX ARRAY)
  ========================= */
  getReceivablesScheduleGroupingEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrepaymentsStoreActions.ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING,
      ),
      switchMap((action: any) =>
        of([
          buildGrouping(action.payload?.uid, action.payload?.documentNumber),
        ]).pipe(
          // ✅ FIX
          map(
            (receivablesScheduleGrouping) =>
              new PrepaymentsStoreActions.GetReceivablesScheduleGroupingSuccessAction(
                {
                  receivablesScheduleGrouping,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     REQUEST SCHEDULE
  ========================= */
  requestReceivablesScheduleEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.REQUEST_RECEIVABLES_SCHEDULE),
      switchMap((action: any) =>
        of(
          buildSchedule(action.payload?.uid, action.payload?.documentNumber),
        ).pipe(
          map(
            () =>
              new PrepaymentsStoreActions.RequestReceivablesScheduleSuccessAction(),
          ),
        ),
      ),
    ),
  );

  /* =========================
     FINALIZE PUNCTUAL
  ========================= */
  finalizePunctualPrepaymentEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT),
      switchMap((action: any) =>
        of(
          buildFinalizePunctual(
            action.payload?.uid,
            action.payload?.documentNumber,
          ),
        ).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.FinalizePunctualPrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     GET BANKING ACCOUNT
  ========================= */
  getScheduledBankingAccountEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PrepaymentsStoreActions.ActionTypes.GET_BANKING_ACCOUNT_PREPAYMENT,
      ),
      switchMap((action: any) =>
        of(
          buildSchedule(action.payload?.uid, action.payload?.documentNumber),
        ).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetBankingAccountPrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     GET SCHEDULED RATE
  ========================= */
  getScheduledRateEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT),
      switchMap(() =>
        of(buildRate()).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetScheduledRatePrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     GET PUNCTUAL RATE
  ========================= */
  getPunctualRateEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT),
      switchMap(() =>
        of(buildRate()).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetPunctualRatePrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     FINALIZE SCHEDULED
  ========================= */
  finalizeScheduledPrepaymentEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT),
      switchMap((action: any) =>
        of(buildFinalizeScheduled(action.payload.uid)).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.FinalizeScheduledPrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     AUTHORIZATION GET
  ========================= */
  getAuthorizationEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_AUTHORIZATION),
      switchMap(() =>
        of(buildAuthorization()).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetAuthorizationSuccessAction({
                response,
              }),
          ),
        ),
      ),
    ),
  );

  /* =========================
     AUTHORIZATION POST
  ========================= */
  postAuthorizationEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.AUTHORIZE),
      switchMap(() =>
        of({ timestamp: new Date(), error: '', message: '' }).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.AuthorizeSuccessAction({
                response,
              }),
          ),
        ),
      ),
    ),
  );

  /* =========================
     GET SCHEDULED FINALIZED (FIX DTO)
  ========================= */
  getScheduledFinalizedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_FINALIZED),
      switchMap((action: any) =>
        of(buildScheduledFinalized(action.payload.uid)).pipe(
          // ✅ FIX
          map(
            (response) =>
              new PrepaymentsStoreActions.GetScheduledFinalizedSuccessAction({
                response,
              }),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.GetScheduledFinalizedFailureAction({
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     CANCEL SCHEDULED
  ========================= */
  cancelScheduledFinalizedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.CANCEL_SCHEDULED_PREPAYMENT),
      switchMap((action: any) =>
        of(buildCancelScheduled(action.payload.uid)).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.CancelScheduledPrepaymentSuccessAction(
                {
                  response,
                },
              ),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.CancelScheduledPrepaymentFailureAction(
                {
                  error,
                },
              ),
            ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     HISTORIC
  ========================= */
  getHistoricEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_HISTORIC),
      switchMap((action: any) =>
        of(
          buildHistoric(action.payload?.uid, action.payload?.documentNumber),
        ).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetHistoricSuccessAction({
                response,
              }),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.GetHistoricFailureAction({
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     ACCREDITATIONS (PUNCTUAL)
  ========================= */
  getPunctualAccreditationsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_PUNCTUAL_ACCREDITATIONS),
      switchMap(() =>
        of(buildAccreditations()).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetPunctualAccreditationsSuccessAction(
                {
                  response,
                },
              ),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.GetPunctualAccreditationsFailureAction(
                {
                  error,
                },
              ),
            ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     ACCREDITATIONS (SCHEDULED)
  ========================= */
  getScheduledAccreditationsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_ACCREDITATIONS),
      switchMap(() =>
        of(buildAccreditations()).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.GetScheduledAccreditationsSuccessAction(
                {
                  response,
                },
              ),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.GetScheduledAccreditationsFailureAction(
                {
                  error,
                },
              ),
            ),
          ),
        ),
      ),
    ),
  );

  /* =========================
     SAVE LEAD
  ========================= */
  getSaveLeadEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrepaymentsStoreActions.ActionTypes.SAVE_LEAD),
      switchMap(() =>
        of({ success: true, error: '' }).pipe(
          map(
            (response) =>
              new PrepaymentsStoreActions.SaveLeadSuccessAction({
                response,
              }),
          ),
          catchError((error) =>
            of(
              new PrepaymentsStoreActions.SaveLeadFailureAction({
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
