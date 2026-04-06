import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { PrepaymentsStoreActions, PrepaymentsStoreSelectors } from '.';
import { AuthStoreSelectors, CoreStoreSelectors } from '..';
import { AdministrationStoreSelectors } from '../administration-store';
import { AppState } from '../state';
import { PrepaymentsService } from './prepayments.service';


@Injectable()
export class PrepaymentsStoreEffects {
  constructor(
    private prepaymentsService: PrepaymentsService,
    private sessionStorageService: SessionStorageService,
    private store$: Store<AppState>,
    private actions$: Actions) { }

  getReceivablesScheduleGroupingEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetReceivablesScheduleGroupingAction>(PrepaymentsStoreActions.ActionTypes.GET_RECEIVABLES_SCHEDULE_GROUPING),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([, userEmail, uids, deviceType, uuid]) => {
        return this.prepaymentsService
          .getReceivablesScheduleInformationGrouping(
            userEmail,
            uids,
            deviceType,
            uuid)
          .pipe(
            map((receivablesScheduleGrouping) => new PrepaymentsStoreActions.GetReceivablesScheduleGroupingSuccessAction({ receivablesScheduleGrouping }))
          );
      })
    )
  );

  requestReceivablesScheduleEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.RequestReceivablesScheduleAction>(PrepaymentsStoreActions.ActionTypes.REQUEST_RECEIVABLES_SCHEDULE),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .requestReceivablesSchedule(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.RequestReceivablesScheduleSuccessAction())
          );
      })
    )
  );

  finalizePunctualPrepaymentEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.FinalizePunctualPrepaymentAction>(PrepaymentsStoreActions.ActionTypes.FINALIZE_PUNCTUAL_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .finalizePunctualPrepayment(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.schedules)
          .pipe(
            map((response) => new PrepaymentsStoreActions.FinalizePunctualPrepaymentSuccessAction({ response }))
          );
      })
    )
  );

  getScheduledBankingAccountEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetBankingAccountPrepaymentAction>(PrepaymentsStoreActions.ActionTypes.GET_BANKING_ACCOUNT_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([, userEmail, uids, deviceType, uuid]) => {
        return this.prepaymentsService
          .getScheduledBankingAccount(
            userEmail,
            uids,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetBankingAccountPrepaymentSuccessAction({ response }))
          );
      })
    )
  );

  getScheduledRateEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetScheduledRatePrepaymentAction>(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_RATE_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getScheduledRate(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.prepaymentTotalAmount)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetScheduledRatePrepaymentSuccessAction({ response }))
          );
      })
    )
  );

  getPunctualRateEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetPunctualRatePrepaymentAction>(PrepaymentsStoreActions.ActionTypes.GET_PUNCTUAL_RATE_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getPunctualRate(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.prepaymentTotalAmount)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetPunctualRatePrepaymentSuccessAction({ response }))
          );
      })
    )
  );

  finalizeScheduledPrepaymentEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.FinalizeScheduledPrepaymentAction>(PrepaymentsStoreActions.ActionTypes.FINALIZE_SCHEDULED_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .finalizeScheduledPrepayment(
            userEmail,
            deviceType,
            uuid,
            action.payload.request)
          .pipe(
            map((response) => new PrepaymentsStoreActions.FinalizeScheduledPrepaymentSuccessAction({ response }))
          );
      })
    )
  );

  getAuthorizationEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetAuthorizationAction>(PrepaymentsStoreActions.ActionTypes.GET_AUTHORIZATION),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getAuthorization(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(map((response) => new PrepaymentsStoreActions.GetAuthorizationSuccessAction({ response })));
      })
    )
  );

  postAuthorizationEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.AuthorizeAction>(PrepaymentsStoreActions.ActionTypes.AUTHORIZE),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .postAuthorize(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.AuthorizeSuccessAction({ response }))
          );
      })
    )
  );

  getScheduledFinalizedEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetScheduledFinalizedAction>(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_FINALIZED),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getScheduledFinalized(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetScheduledFinalizedSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.GetScheduledFinalizedFailureAction({ error }));
            })
          );
      })
    )
  );

  cancelScheduledFinalizedEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.CancelScheduledPrepaymentAction>(PrepaymentsStoreActions.ActionTypes.CANCEL_SCHEDULED_PREPAYMENT),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .cancelScheduledFinalized(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.id)
          .pipe(
            map((response) => new PrepaymentsStoreActions.CancelScheduledPrepaymentSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.CancelScheduledPrepaymentFailureAction({ error }));
            })
          );
      })
    )
  );

  getHistoricEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetHistoricAction>(PrepaymentsStoreActions.ActionTypes.GET_HISTORIC),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getHistoric(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.initialDate,
            action.payload.finalDate)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetHistoricSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.GetHistoricFailureAction({ error }));
            })
          );
      })
    )
  );

  getPunctualAccreditationsEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetPunctualAccreditationsAction>(PrepaymentsStoreActions.ActionTypes.GET_PUNCTUAL_ACCREDITATIONS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getPunctualAccreditations(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetPunctualAccreditationsSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.GetPunctualAccreditationsFailureAction({ error }));
            })
          );
      })
    )
  );

  getScheduledAccreditationsEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.GetScheduledAccreditationsAction>(PrepaymentsStoreActions.ActionTypes.GET_SCHEDULED_ACCREDITATIONS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .getScheduledAccreditations(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid)
          .pipe(
            map((response) => new PrepaymentsStoreActions.GetScheduledAccreditationsSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.GetScheduledAccreditationsFailureAction({ error }));
            })
          );
      })
    )
  );

  getSaveLeadEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<PrepaymentsStoreActions.SaveLeadAction>(PrepaymentsStoreActions.ActionTypes.SAVE_LEAD),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectUuid)),
      ),
      switchMap(([action, userEmail, deviceType, uuid]) => {
        return this.prepaymentsService
          .postSaveLead(
            userEmail,
            action.payload.uid,
            deviceType,
            uuid,
            action.payload.leadAction,
            action.payload.itStarted,
            action.payload.finished,
            action.payload.canceled)
          .pipe(
            map((response) => new PrepaymentsStoreActions.SaveLeadSuccessAction({ response })),
            catchError((error: any) => {
              return of(new PrepaymentsStoreActions.SaveLeadFailureAction({ error }));
            })
          );
      })
    )
  );

  persistStateEffect$ = createEffect(() =>
    this.store$.pipe(
      withLatestFrom(
        this.store$.pipe(select(PrepaymentsStoreSelectors.selectPrepaymentsState)),
      ),
      distinctUntilChanged(),
      tap(([, state]) => {
        this.sessionStorageService.setItem('prepayments.scheduled-rate', state.scheduledRate);
        this.sessionStorageService.setItem('prepayments.punctual-rate', state.punctualRate);
      })
    ),
    { dispatch: false }
  );
}
