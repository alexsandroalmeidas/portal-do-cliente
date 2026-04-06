import { Action } from '@ngrx/store';

import { AppRoles } from '../../shared/models/app-roles';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  Permission,
  Role,
  UserEstablishmentPermission
} from './identity.models';

export enum ActionTypes {
  UPDATE_ROLE = '@app/identity/update-role',
  UPDATE_ROLE_SUCCESS = '@app/identity/update-role-success',
  UPDATE_ROLE_FAILURE = '@app/identity/update-role-failure',
  ADD_ROLE = '@app/identity/insert-role',
  ADD_ROLE_SUCCESS = '@app/identity/insert-role-success',
  ADD_ROLE_FAILURE = '@app/identity/insert-role-failure',
  LIST_CLIENT_ROLES = '@app/identity/list-client-roles',
  LIST_CLIENT_ROLES_SUCCESS = '@app/identity/list-client-roles-success',
  LIST_CLIENT_ROLES_FAILURE = '@app/identity/list-client-roles-failure',
  GET_CLIENT_ROLE = '@app/identity/get-client-role',
  GET_CLIENT_ROLE_SUCCESS = '@app/identity/get-client-role-success',
  GET_CLIENT_ROLE_FAILURE = '@app/identity/get-client-role-failure',
  ADD_CLIENT_ROLE = '@app/identity/insert-client-role',
  ADD_CLIENT_ROLE_SUCCESS = '@app/identity/insert-client-role-success',
  ADD_CLIENT_ROLE_FAILURE = '@app/identity/insert-client-role-failure',
  DELETE_CLIENT_ROLE = '@app/identity/delete-client-role',
  DELETE_CLIENT_ROLE_SUCCESS = '@app/identity/delete-client-role-success',
  DELETE_CLIENT_ROLE_FAILURE = '@app/identity/delete-client-role-failure',
  LIST_ROLE_PERMISSIONS = '@app/identity/list-role-permissions',
  LIST_ROLE_PERMISSIONS_SUCCESS = '@app/identity/list-role-permissions-success',
  LIST_ROLE_PERMISSIONS_FAILURE = '@app/identity/list-role-permissions-failure',
  PASSWORD_RECOVER = '@app/identity/password-recover',
  PASSWORD_RECOVER_SUCCESS = '@app/identity/password-recover-success',
  PASSWORD_RECOVER_FAILURE = '@app/identity/password-recover-failure',
  GET_USER_ROLES = '@app/identity/get-user-roles',
  GET_USER_ROLES_SUCCESS = '@app/identity/get-user-roles-success',
  GET_USER_ROLES_FAILURE = '@app/identity/get-user-roles-failure',
  LIST_USER_PERMISSIONS = '@app/identity/list-user-permissions',
  LIST_USER_PERMISSIONS_SUCCESS = '@app/identity/list-user-permissions-success',
  LIST_USER_PERMISSIONS_FAILURE = '@app/identity/list-user-permissions-failure',
  CHANGE_PASSWORD = '@app/identity/change-password',
  CHANGE_PASSWORD_SUCCESS = '@app/identity/change-password-success',
  CHANGE_PASSWORD_FAILURE = '@app/identity/change-password-failure',
  CHANGED_PASSWORD = '@app/identity/changed-password',
  RESET_IDENTITY_STATE = '@app/identity/reset-identity-state'
}

export class AddRoleAction implements Action {
  readonly type = ActionTypes.ADD_ROLE;
  constructor(public payload: { role: Role }) {}
}

export class AddRoleSuccessAction implements Action {
  readonly type = ActionTypes.ADD_ROLE_SUCCESS;
  constructor(public payload: { role: Role }) {}
}

export class AddRoleFailureAction implements Action {
  readonly type = ActionTypes.ADD_ROLE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class UpdateRoleAction implements Action {
  readonly type = ActionTypes.UPDATE_ROLE;
  constructor(public payload: { role: Role }) {}
}

export class UpdateRoleSuccessAction implements Action {
  readonly type = ActionTypes.UPDATE_ROLE_SUCCESS;
  constructor(public payload: { role: Role }) {}
}

export class UpdateRoleFailureAction implements Action {
  readonly type = ActionTypes.UPDATE_ROLE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ListClientRolesAction implements Action {
  readonly type = ActionTypes.LIST_CLIENT_ROLES;
  constructor() {}
}

export class ListClientRolesSuccessAction implements Action {
  readonly type = ActionTypes.LIST_CLIENT_ROLES_SUCCESS;
  constructor(public payload: { roles: Role[] }) {}
}

export class ListClientRolesFailureAction implements Action {
  readonly type = ActionTypes.LIST_CLIENT_ROLES_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class GetClientRoleAction implements Action {
  readonly type = ActionTypes.GET_CLIENT_ROLE;
  constructor(public payload: { roleId: string }) {}
}

export class GetClientRoleSuccessAction implements Action {
  readonly type = ActionTypes.GET_CLIENT_ROLE_SUCCESS;
  constructor(public payload: { role: Role }) {}
}

export class GetClientRoleFailureAction implements Action {
  readonly type = ActionTypes.GET_CLIENT_ROLE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class DeleteClientRoleAction implements Action {
  readonly type = ActionTypes.DELETE_CLIENT_ROLE;
  constructor(public payload: { roleId: string }) {}
}

export class DeleteClientRoleSuccessAction implements Action {
  readonly type = ActionTypes.DELETE_CLIENT_ROLE_SUCCESS;
  constructor(public payload: { roleId: string }) {}
}

export class DeleteClientRoleFailureAction implements Action {
  readonly type = ActionTypes.DELETE_CLIENT_ROLE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class AddClientRoleAction implements Action {
  readonly type = ActionTypes.ADD_CLIENT_ROLE;
  constructor(public payload: { roleId: string }) {}
}

export class AddClientRoleSuccessAction implements Action {
  readonly type = ActionTypes.ADD_CLIENT_ROLE_SUCCESS;
  constructor(public payload: { roleId: string }) {}
}

export class AddClientRoleFailureAction implements Action {
  readonly type = ActionTypes.ADD_CLIENT_ROLE_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ListRolePermissionsAction implements Action {
  readonly type = ActionTypes.LIST_ROLE_PERMISSIONS;
  constructor(public payload: { roleId: string }) {}
}

export class ListRolePermissionsSuccessAction implements Action {
  readonly type = ActionTypes.LIST_ROLE_PERMISSIONS_SUCCESS;
  constructor(public payload: { permissions: Permission[] }) {}
}

export class ListRolePermissionsFailureAction implements Action {
  readonly type = ActionTypes.LIST_ROLE_PERMISSIONS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class PasswordRecoverAction implements Action {
  readonly type = ActionTypes.PASSWORD_RECOVER;
  constructor(public payload: { email: string }) {}
}

export class PasswordRecoverSuccessAction implements Action {
  readonly type = ActionTypes.PASSWORD_RECOVER_SUCCESS;
  constructor(public payload: { response: ForgotPasswordResponse }) {}
}

export class PasswordRecoverFailureAction implements Action {
  readonly type = ActionTypes.PASSWORD_RECOVER_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class GetUserRolesAction implements Action {
  readonly type = ActionTypes.GET_USER_ROLES;
  constructor(public payload: { userId: string }) {}
}

export class GetUserRolesSuccessAction implements Action {
  readonly type = ActionTypes.GET_USER_ROLES_SUCCESS;
  constructor(public payload: { roles: AppRoles[] }) {}
}

export class GetUserRolesFailureAction implements Action {
  readonly type = ActionTypes.GET_USER_ROLES_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ListUserPermissionsAction implements Action {
  readonly type = ActionTypes.LIST_USER_PERMISSIONS;
  constructor(public payload: { selectedEstablishments: string[] }) {}
}

export class ListUserPermissionsSuccessAction implements Action {
  readonly type = ActionTypes.LIST_USER_PERMISSIONS_SUCCESS;
  constructor(public payload: { permissions: UserEstablishmentPermission[] }) {}
}

export class ListUserPermissionsFailureAction implements Action {
  readonly type = ActionTypes.LIST_USER_PERMISSIONS_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ChangePasswordAction implements Action {
  readonly type = ActionTypes.CHANGE_PASSWORD;
  constructor(public payload: { currentPassword: string; newPassword: string }) {}
}

export class ChangePasswordSuccessAction implements Action {
  readonly type = ActionTypes.CHANGE_PASSWORD_SUCCESS;
  constructor(public payload: { response: ChangePasswordResponse }) {}
}

export class ChangePasswordFailureAction implements Action {
  readonly type = ActionTypes.CHANGE_PASSWORD_FAILURE;
  constructor(public payload: { error: any }) {}
}

export class ChangedPasswordAction implements Action {
  readonly type = ActionTypes.CHANGED_PASSWORD;
}

export class ResetIdentityStateAction implements Action {
  readonly type = ActionTypes.RESET_IDENTITY_STATE;
}

export type Actions =
  | AddRoleAction
  | AddRoleSuccessAction
  | AddRoleFailureAction
  | UpdateRoleAction
  | UpdateRoleSuccessAction
  | UpdateRoleFailureAction
  | ListClientRolesAction
  | ListClientRolesSuccessAction
  | ListClientRolesFailureAction
  | GetClientRoleAction
  | GetClientRoleSuccessAction
  | GetClientRoleFailureAction
  | DeleteClientRoleAction
  | DeleteClientRoleSuccessAction
  | DeleteClientRoleFailureAction
  | AddClientRoleAction
  | AddClientRoleSuccessAction
  | AddClientRoleFailureAction
  | ListRolePermissionsAction
  | ListRolePermissionsSuccessAction
  | ListRolePermissionsFailureAction
  | PasswordRecoverAction
  | PasswordRecoverSuccessAction
  | PasswordRecoverFailureAction
  | GetUserRolesAction
  | GetUserRolesSuccessAction
  | GetUserRolesFailureAction
  | ListUserPermissionsAction
  | ListUserPermissionsSuccessAction
  | ListUserPermissionsFailureAction
  | ChangePasswordAction
  | ChangePasswordSuccessAction
  | ChangePasswordFailureAction
  | ChangedPasswordAction
  | ResetIdentityStateAction;
