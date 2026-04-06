export interface PermissionsGroup {
  id: string;
  name: string;
  description: string;
  globalizationKey: null;
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  globalizationKey: null;
  authorization: Authorization;
}

export enum Authorization {
  allowed = 1,
  denied = 2,
  notSet = 3
}
