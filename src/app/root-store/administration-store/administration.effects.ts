import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  delay,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  AuthStoreSelectors,
  CoreStoreSelectors,
  RootStoreState,
} from './../../root-store';
import {
  AdministrationStoreActions,
  AdministrationStoreSelectors,
} from './../administration-store';
import { AdministrationService } from './administration.service';
import { LoggingService } from 'src/app/shared/services/logging.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { Establishment } from './administration.models';
import {
  mockRatesResponse,
  mockReserveResponse,
  mockBankingAccountsResponse,
  mockEstablishments,
} from './administration.mock';

@Injectable()
export class AdministrationStoreEffects {
  private ROWKEYDEFAULT = 'punto6789-3fb7-45cb-853a-d8e9fe9ed477';

  constructor(
    private administrationService: AdministrationService,
    private loggingService: LoggingService,
    private sessionStorageService: SessionStorageService,
    private actions$: Actions,
    private store$: Store<RootStoreState.AppState>,
  ) {}

  getEconomicsGroupsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AdministrationStoreActions.GetEconomicGroupAction>(
        AdministrationStoreActions.ActionTypes.GET_ECONOMIC_GROUPS,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthData)),
      ),
      switchMap(([action, authData]) => {
        return of(mockEstablishments).pipe(
          map(
            (establishments) =>
              new AdministrationStoreActions.GetEconomicGroupSuccessAction({
                establishments,
              }),
          ),
        );
      }),
    ),
  );

  setUserCustomersEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AdministrationStoreActions.SetUserCustomersAction>(
        AdministrationStoreActions.ActionTypes.SET_USER_CUSTOMERS,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectAuthState)),
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
      ),
      switchMap(([action, authState, userEmail]) => {
        // 🔥 MOCK
        const fakeRowKey = 'mock-row-key-123';

        return of(fakeRowKey).pipe(
          delay(300),
          map(
            (rowKey) =>
              new AdministrationStoreActions.SetUserCustomersSuccessAction({
                rowKey,
              }),
          ),
        );
      }),
    ),
  );

  persistStateEffect$ = createEffect(
    () =>
      this.store$.pipe(
        withLatestFrom(
          this.store$.pipe(
            select(AdministrationStoreSelectors.selectAdministrationState),
          ),
        ),
        distinctUntilChanged(),
        tap(([, state]) => {
          this.sessionStorageService.setItem(
            'administration.selected-establishments',
            state.selectedEstablishments,
          );
          this.sessionStorageService.setItem(
            'administration.economic-group-phone',
            state.economicGroupPhone,
          );
        }),
      ),
    { dispatch: false },
  );

  userLogffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AdministrationStoreActions.UserLogAction>(
        AdministrationStoreActions.ActionTypes.USER_LOG,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectRowKeySignin)),
        this.store$.pipe(select(CoreStoreSelectors.selectDeviceType)),
        this.store$.pipe(select(CoreStoreSelectors.selectDevice)),
      ),
      switchMap(([action, rowKeySignin, deviceType, device]) => {
        return this.loggingService
          .postLogging(
            action.payload.userName,
            action.payload.action,
            deviceType,
            device,
          )
          .pipe(
            map((ret) => {
              var rowKey = this.ROWKEYDEFAULT;

              if (!!rowKeySignin) {
                rowKey = rowKeySignin;
              } else if (
                !!this.sessionStorageService.getItem('auth.row-key-signin')
              ) {
                rowKey = this.sessionStorageService.getItem(
                  'auth.row-key-signin',
                );
              }

              return new AdministrationStoreActions.UserLogSuccessAction({
                rowKey,
              });
            }),
          );
      }),
    ),
  );

  getEconomicGroupPhoneEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AdministrationStoreActions.GetEconomicGroupPhoneAction>(
        AdministrationStoreActions.ActionTypes.GET_ECONOMIC_GROUP_PHONE,
      ),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
      ),
      switchMap(([, userEmail]) => {
        return this.administrationService.getEconomicGroupPhone(userEmail).pipe(
          map(
            (response) =>
              new AdministrationStoreActions.GetEconomicGroupPhoneSuccessAction(
                { response },
              ),
          ),
          catchError((error: any) => {
            return of(
              new AdministrationStoreActions.GetEconomicGroupPhoneFailureAction(
                { error },
              ),
            );
          }),
        );
      }),
    ),
  );

  getEconomicGroupRatesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationStoreActions.ActionTypes.GET_ECONOMIC_GROUP_RATES),
      switchMap(() =>
        of(mockRatesResponse).pipe(
          map(
            (response) =>
              new AdministrationStoreActions.GetEconomicGroupRatesSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  getEconomicGroupReserveEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdministrationStoreActions.ActionTypes.GET_ECONOMIC_GROUP_RESERVE),
      switchMap(() =>
        of(mockReserveResponse).pipe(
          map(
            (response) =>
              new AdministrationStoreActions.GetEconomicGroupReserveSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );

  getEconomicGroupBankingAccountsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AdministrationStoreActions.ActionTypes
          .GET_ECONOMIC_GROUP_BANKING_ACCOUNTS,
      ),
      switchMap(() =>
        of(mockBankingAccountsResponse).pipe(
          map(
            (response) =>
              new AdministrationStoreActions.GetEconomicGroupBankingAccountsSuccessAction(
                {
                  response,
                },
              ),
          ),
        ),
      ),
    ),
  );
}
