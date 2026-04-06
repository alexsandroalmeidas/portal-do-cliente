export interface Role {
  id: string;
  name: string;
  description: string;
  globalizationKey: string;
}

export interface Permission {
  allowed?: boolean;
  resource: Resource;
}

export interface UserEstablishmentPermission {
  userId: string;
  allowed?: boolean;
  description: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  globalizationKey: null;
  resourceGroup: ResourceGroup;
}

export interface ResourceGroup {
  id: string;
  name: string;
  description: string;
  globalizationKey: null;
}

export interface ChangePasswordResponse {
  isSuccessfully: boolean;
  errorMessage: string;
}

export interface ForgotPasswordResponse {
  isSuccessfully: boolean;
  errorMessage: string;
  successMessage: string;
}