import { RouterReducerState } from '@ngrx/router-store';

import { AdministrationStoreState } from './administration-store';
import { AuthStoreState } from './auth-store';
import { CommunicationStoreState } from './communication-store';
import { CoreStoreState } from './core-store';
import { IdentityStoreState } from './identity-store';
import { MfaStoreState } from './mfa-store';
import { PrepaymentsStoreState } from './prepayments-store';
import { ReceivablesStoreState } from './receivables-store';
import { ReportsStoreState } from './reports-store';
import { RouterStateUrl } from './router-store';
import { SalesStoreState } from './sales-store';
import { SettingsStoreState } from './settings-store';
import { StatementsStoreState } from './statements-store';

export interface AppState {
  identity: IdentityStoreState.IdentityState;
  administration: AdministrationStoreState.AdministrationState;
  auth: AuthStoreState.AuthState;
  communication: CommunicationStoreState.CommunicationState;
  core: CoreStoreState.CoreState;
  mfa: MfaStoreState.MfaState;
  prepayments: PrepaymentsStoreState.PrepaymentsState;
  receivables: ReceivablesStoreState.ReceivablesState;
  reports: ReportsStoreState.ReportsState;
  router: RouterReducerState<RouterStateUrl>;
  sales: SalesStoreState.SalesState;
  settings: SettingsStoreState.SettingsState;
  statements: StatementsStoreState.StatementsState;
}
