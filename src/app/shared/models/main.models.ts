import { AppRoles } from './app-roles';

export interface NavigationItem {
  path?: string;
  icon: string;
  label: string;
  roles: AppRoles[];
  children?: NavigationItem[];
  hasPermission: boolean;
  order: number;
}
