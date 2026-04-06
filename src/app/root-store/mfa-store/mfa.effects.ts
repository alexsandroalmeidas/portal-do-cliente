import { environment as env } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthStoreSelectors, RootStoreState } from '..';
import { AdministrationStoreSelectors } from '../administration-store';
import { AdministrationService } from '../administration-store/administration.service';
import { MfaStoreActions, MfaStoreSelectors } from '../mfa-store';
import { MfaService } from './mfa.service';

@Injectable()
export class MfaStoreEffects {

  constructor(
    private mfaService: MfaService,
    private administrationService: AdministrationService,
    private actions$: Actions,
    private store$: Store<RootStoreState.AppState>
  ) { }

  sendPinSmsEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.SendPinSmsAction>(MfaStoreActions.ActionTypes.SEND_PIN_SMS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail))
      ),
      switchMap(([action, userEmail]) => {

        return this.mfaService
          .postSendPinSms(
            userEmail,
            action.payload.phoneNumber
          )
          .pipe(
            map((response) => new MfaStoreActions.SendPinSmsSuccessAction({ pinIdSms: response?.result?.pinId || '' })),
            catchError((error: any) => {
              return of(new MfaStoreActions.SendPinSmsFailureAction({ error }));
            })
          );
      })
    )
  );

  sendPinEmailEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.SendPinEmailAction>(MfaStoreActions.ActionTypes.SEND_PIN_EMAIL),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail))
      ),
      switchMap(([action, userEmail]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.mfaService
          .postSendPinEmail(email?.toLocaleLowerCase())
          .pipe(
            map((response) => new MfaStoreActions.SendPinEmailSuccessAction({ pinIdEmail: response?.result?.pinId || '' })),
            catchError((error: any) => {
              return of(new MfaStoreActions.SendPinEmailFailureAction({ error }));
            })
          );
      })
    )
  );

  resendPinSmsEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.ResendPinSmsAction>(MfaStoreActions.ActionTypes.RESEND_PIN_SMS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(MfaStoreSelectors.selectPinIdSms))
      ),
      switchMap(([action, userEmail, pindId]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.mfaService
          .postResendPinSms(email?.toLocaleLowerCase(), pindId)
          .pipe(
            map((response) => new MfaStoreActions.ResendPinSmsSuccessAction({ pinIdSms: response?.result?.pinId || '' })),
            catchError((error: any) => {
              return of(new MfaStoreActions.ResendPinSmsFailureAction({ error }));
            })
          );
      })
    )
  );

  verifyPinSmsEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.VerifyPinSmsAction>(MfaStoreActions.ActionTypes.VERIFY_PIN_SMS),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(MfaStoreSelectors.selectPinIdSms))
      ),
      switchMap(([action, userEmail, pinId]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.mfaService
          .postVerifyPinSms(email?.toLocaleLowerCase(), pinId, action.payload.pinCode)
          .pipe(
            map((response) => new MfaStoreActions.VerifyPinSmsSuccessAction({ verifiedPinSms: response?.result?.verified || false })),
            catchError((error: any) => {
              return of(new MfaStoreActions.VerifyPinSmsFailureAction({ error }));
            })
          );
      })
    )
  );

  verifyPinEmailEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.VerifyPinEmailAction>(MfaStoreActions.ActionTypes.VERIFY_PIN_EMAIL),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(MfaStoreSelectors.selectPinIdEmail)),
      ),
      switchMap(([action, userEmail, pinId]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.mfaService
          .postVerifyPinEmail(email?.toLocaleLowerCase(), pinId, action.payload.pinCode)
          .pipe(
            map((response) => new MfaStoreActions.VerifyPinEmailSuccessAction({ verifiedPinEmail: response?.result?.verified || false })),
            catchError((error: any) => {
              return of(new MfaStoreActions.VerifyPinEmailFailureAction({ error }));
            })
          );
      })
    )
  );

  resendPinEmailEffect$ = createEffect(() => () =>
    this.actions$.pipe(
      ofType<MfaStoreActions.ResendPinEmailAction>(MfaStoreActions.ActionTypes.RESEND_PIN_EMAIL),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(MfaStoreSelectors.selectPinIdEmail)),
      ),
      switchMap(([action, userEmail, pinId]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.mfaService
          .postResendPinEmail(email?.toLocaleLowerCase(), pinId)
          .pipe(
            map((response) => new MfaStoreActions.ResendPinEmailSuccessAction({ pinIdEmail: response?.result?.pinId || '' })),
            catchError((error: any) => {
              return of(new MfaStoreActions.ResendPinEmailFailureAction({ error }));
            })
          );
      })
    )
  );

  verificationCompletedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<MfaStoreActions.VerificationCompletedAction>(MfaStoreActions.ActionTypes.VERIFICATION_COMPLETED),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail)),
        this.store$.pipe(select(MfaStoreSelectors.selectPhoneNumber)),
        this.store$.pipe(select(AdministrationStoreSelectors.selectSelectedEstablishmentsUids)),
      ),
      switchMap(([action, userEmail, phoneNumber, documents]) => {

        const email = env.debug
          ? 'alexsandro@tinotech.com.br'
          : userEmail;

        return this.administrationService
          .addPhoneNumber(email?.toLocaleLowerCase(), phoneNumber, documents)
          .pipe(
            map(response => {
              return new MfaStoreActions.VerificationCompletedSuccessAction({
                response,
                email: userEmail
              });
            }),
            catchError((error: any) => {
              return of(new MfaStoreActions.VerificationCompletedFailureAction({ error }));
            })
          );
      })
    )
  );

  verifyShowMfaEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<MfaStoreActions.VerifyShowMfaAction>(MfaStoreActions.ActionTypes.VERIFY_SHOW_MFA),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail))
      ),
      switchMap(([, userEmail]) => {

        return this.mfaService
          .verifyShowMfa(userEmail)
          .pipe(
            map(response => {
              return new MfaStoreActions.VerifyShowMfaSuccessAction({ response: response.result?.showMfa || true });
            }),
            catchError((error: any) => {
              return of(new MfaStoreActions.VerifyShowMfaFailureAction({ error }));
            })
          );
      })
    )
  );

  verifiedMfaEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType<MfaStoreActions.VerifiedMfaAction>(MfaStoreActions.ActionTypes.VERIFIED_MFA),
      withLatestFrom(
        this.store$.pipe(select(AuthStoreSelectors.selectUserEmail))
      ),
      switchMap(([, userEmail]) => {
        return this.mfaService
          .verifiedMfa(userEmail)
          .pipe(
            map(response => { return new MfaStoreActions.VerifiedMfaSuccessAction(); }),
            catchError((error: any) => {
              return of(new MfaStoreActions.VerifiedMfaFailureAction({ error }));
            })
          );
      })
    )
  );
}
