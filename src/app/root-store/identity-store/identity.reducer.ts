import { Actions, ActionTypes } from './identity.actions';
import { IdentityState, initialState } from './identity.state';

export function featureReducer(state = initialState, action: Actions): IdentityState {
  switch (action.type) {
    case ActionTypes.LIST_CLIENT_ROLES: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.LIST_CLIENT_ROLES_SUCCESS: {
      const { roles } = action.payload;

      return {
        ...state,
        roles: roles,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.LIST_CLIENT_ROLES_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error
      };
    }
    case ActionTypes.GET_CLIENT_ROLE: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.GET_CLIENT_ROLE_SUCCESS: {
      const { role } = action.payload;

      return {
        ...state,
        currentRole: role,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.GET_CLIENT_ROLE_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error,
        currentRole: undefined
      };
    }
    case ActionTypes.DELETE_CLIENT_ROLE: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.DELETE_CLIENT_ROLE_SUCCESS: {
      const { roleId } = action.payload;
      const { roles } = state;

      return {
        ...state,
        currentRole: undefined,
        roles: roles.filter((r) => r.id != roleId),
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.DELETE_CLIENT_ROLE_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error
      };
    }
    case ActionTypes.ADD_ROLE: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.ADD_ROLE_SUCCESS: {
      const { role } = action.payload;
      const { roles } = state;

      return {
        ...state,
        roles: [...roles, role],
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.ADD_ROLE_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error
      };
    }

    case ActionTypes.UPDATE_ROLE: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.UPDATE_ROLE_SUCCESS: {
      const { role } = action.payload;
      const { roles } = state;

      const updatedRole = roles.find((r) => r.id === role.id);

      if (!!updatedRole) {
        updatedRole.name = role.name;
        updatedRole.description = role.description;
        updatedRole.globalizationKey = role.globalizationKey;
      }

      return {
        ...state,
        roles,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.UPDATE_ROLE_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error
      };
    }
    case ActionTypes.LIST_ROLE_PERMISSIONS_SUCCESS: {
      const { permissions } = action.payload;

      return {
        ...state,
        rolePermissions: permissions,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.LIST_ROLE_PERMISSIONS_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        rolePermissions: [],
        isLoading: false,
        error
      };
    }
    case ActionTypes.LIST_USER_PERMISSIONS_SUCCESS: {
      const { permissions } = action.payload;

      return {
        ...state,
        userPermissions: permissions,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.LIST_USER_PERMISSIONS_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        userPermissions: [],
        isLoading: false,
        error
      };
    }
    case ActionTypes.PASSWORD_RECOVER_FAILURE: {
      return {
        ...state,
        recoveredPassword: false
      };
    }

    case ActionTypes.GET_USER_ROLES_SUCCESS: {
      const { payload } = action;
      const { roles } = payload;

      return {
        ...state,
        userRoles: roles || []
      };
    }
    case ActionTypes.GET_USER_ROLES_FAILURE: {
      return {
        ...state,
        userRoles: []
      };
    }

    case ActionTypes.CHANGE_PASSWORD:
    case ActionTypes.CHANGED_PASSWORD: {
      return {
        ...state,
        isLoading: true,
        error: null,
        changedPassword: false,
        changedPasswordError: null as any
      };
    }
    case ActionTypes.CHANGE_PASSWORD_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        changedPassword: response.isSuccessfully,
        changedPasswordError: response.errorMessage
      };
    }
    case ActionTypes.CHANGE_PASSWORD_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error,
        changedPassword: false,
        changedPasswordError: error
      };
    }
    case ActionTypes.PASSWORD_RECOVER_SUCCESS: {
      const { response } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        recoveredPassword: response.isSuccessfully,
        recoveredPasswordError: !response.isSuccessfully ? response.errorMessage : '',
        recoveredPasswordSuccess: !response.isSuccessfully ? '' : response.successMessage
      };
    }
    case ActionTypes.PASSWORD_RECOVER_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        isLoading: false,
        error: null,
        recoveredPassword: false,
        recoveredPasswordError: error,
        recoveredPasswordSuccess: ''
      };
    }

    case ActionTypes.RESET_IDENTITY_STATE:
    default: {
      return {
        ...state
      };
    }
  }
}
