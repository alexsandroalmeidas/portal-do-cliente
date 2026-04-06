import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MfaState } from './mfa.state';

export const selectMfaState = createFeatureSelector<MfaState>('mfa');

export const selectPinIdSms: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.pinIdSms);

export const selectPinIdEmail: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.pinIdEmail);

export const selectVerifiedPinSms: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verifiedPinSms);

export const selectSetVerifiedPinSms: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verifiedPinSms);

export const selectVerifiedPinEmail: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verifiedPinEmail);

export const selectSetVerifiedPinEmail: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verifiedPinEmail);

export const selectPhoneNumber: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.phoneNumber);

export const selectVerificationCompleted: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verificationCompleted);

export const selectPinSmsHasError: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.pinSmsError);

export const selectPinEmailHasError: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.pinEmailError);

export const selectVerificationCompletedHasError: MemoizedSelector<object, string> = createSelector(
  selectMfaState,
  (state: MfaState): string => state.verificationCompletedError);

export const selectVerifiyShowMfa: MemoizedSelector<object, boolean> = createSelector(
  selectMfaState,
  (state: MfaState): boolean => state.verifiyShowMfa);
