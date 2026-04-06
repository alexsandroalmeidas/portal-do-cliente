import { AppRoles } from '../../shared/models/app-roles';
import { Permission, Role, UserEstablishmentPermission } from './identity.models';

export interface IdentityState {
  isLoading?: boolean;
  error?: any;
  currentRole?: Role,
  roles: Role[],
  rolePermissions: Permission[],
  recoveredPassword: boolean;
  recoveredPasswordError: string;
  recoveredPasswordSuccess: string;
  userRoles: AppRoles[];
  userPermissions: UserEstablishmentPermission[];
  changedPassword: boolean;
  changedPasswordError: string;
}

export const initialState: IdentityState = {
  isLoading: false,
  error: null,
  roles: [],
  rolePermissions: [],
  userRoles: [],
  userPermissions: [],
  recoveredPassword: false,
  recoveredPasswordError: null as any,
  recoveredPasswordSuccess: null as any,
  changedPassword: false,
  changedPasswordError: null as any
};
