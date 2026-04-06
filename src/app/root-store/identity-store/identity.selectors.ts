import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { Permission, Role } from './identity.models';
import { IdentityState } from './identity.state';
import { AppRoles } from 'src/app/shared/models/app-roles';

export const selectIdentityState = createFeatureSelector<IdentityState>('identity');

export const selectRoles: MemoizedSelector<object, Role[]> = createSelector(
  selectIdentityState,
  (state: IdentityState): Role[] => state.roles);

export const selectCurrentRole: MemoizedSelector<object, Role | undefined> = createSelector(
  selectIdentityState,
  (state: IdentityState): Role | undefined => state.currentRole);

export const selectRolePermissions: MemoizedSelector<object, Permission[]> = createSelector(
  selectIdentityState,
  (state: IdentityState): Permission[] => state.rolePermissions);

export const selectRecoveredPassword: MemoizedSelector<object, boolean | undefined> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean | undefined => state.recoveredPassword
);

export const selectRecoveredPasswordSuccess: MemoizedSelector<object, string> = createSelector(
  selectIdentityState,
  (state: IdentityState): string => state.recoveredPasswordSuccess
);

export const selectRecoveredPasswordFailure: MemoizedSelector<object, string> = createSelector(
  selectIdentityState,
  (state: IdentityState): string => state.recoveredPasswordError
);

export const selectUserRoles: MemoizedSelector<object, AppRoles[]> = createSelector(
  selectIdentityState,
  (state: IdentityState): AppRoles[] => state.userRoles
);

export const selectMyDataPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userRoles[0] == "Administrador"
);

export const selectScheduledPrepaymentPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'antecipacaoautomatica' && x.allowed)
);

export const selectPunctualPrepaymentPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'antecipacaopontual' && x.allowed)
);

export const selectAuthorizationPrepaymentPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'consentimento' && x.allowed)
);

export const selectCommunicationPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'comunicacao' && x.allowed)
);

export const selectMfaPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'mfa' && x.allowed)
);

export const selectRatesFeesPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'taxas' && x.allowed)
);

export const selectBannersPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'banners' && x.allowed)
);

export const selectSalesPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'visualizarvendas' && x.allowed)
);

export const selectReceivablesPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'visualizarrecebimentos' && x.allowed)
);

export const selectStatementsPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'visualizarextratos' && x.allowed)
);

export const selectReportsPermission: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.userPermissions.some(x => x.description.toLocaleLowerCase() === 'visualizarrelatorios' && x.allowed)
);
export const selectPermissionToBanner: MemoizedSelector<object, boolean> = createSelector(
  selectBannersPermission,
  selectPunctualPrepaymentPermission,
  selectScheduledPrepaymentPermission,
  (bannersPermission: boolean, punctualPermission: boolean, scheduledPermission: boolean): boolean =>
    (!bannersPermission && !punctualPermission && !scheduledPermission)
);

export const selectPrepaymentsPermission: MemoizedSelector<object, boolean> = createSelector(
  selectAuthorizationPrepaymentPermission,
  selectPunctualPrepaymentPermission,
  selectScheduledPrepaymentPermission,
  (authorizationPermission: boolean, punctualPermission: boolean, scheduledPermission: boolean): boolean =>
    (authorizationPermission && punctualPermission && scheduledPermission)
);

export const selectChangedPassword: MemoizedSelector<object, boolean> = createSelector(
  selectIdentityState,
  (state: IdentityState): boolean => state.changedPassword
);

export const selectChangedPasswordFailure: MemoizedSelector<object, string> = createSelector(
  selectIdentityState,
  (state: IdentityState): string => state.changedPasswordError
);
