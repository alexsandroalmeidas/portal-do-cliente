import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment as env } from '../../environments/environment';
import { AdministrationStoreModule } from './administration-store/administration-store.module';
import { AuthStoreModule } from './auth-store';
import { CommunicationStoreModule } from './communication-store';
import { CoreStoreModule } from './core-store';
import { IdentityStoreModule } from './identity-store';
import { MfaStoreModule } from './mfa-store';
import { PrepaymentsStoreModule } from './prepayments-store/prepayments-store.module';
import { ReceivablesStoreModule } from './receivables-store';
import { metaReducers } from './reducers';
import { ReportsStoreModule } from './reports-store';
import { RouterStoreModule } from './router-store';
import { SalesStoreModule } from './sales-store';
import { SettingsStoreModule } from './settings-store';
import { StatementsStoreModule } from './statements-store';

@NgModule({
  imports: [
    CommonModule,
    AdministrationStoreModule,
    MfaStoreModule,
    AuthStoreModule,
    RouterStoreModule,
    CoreStoreModule,
    SettingsStoreModule,
    ReceivablesStoreModule,
    SalesStoreModule,
    PrepaymentsStoreModule,
    StatementsStoreModule,
    ReportsStoreModule,
    CommunicationStoreModule,
    IdentityStoreModule,
    StoreModule.forRoot<any>({}, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      name: 'Portal do Cliente',
      logOnly: env.debug
    }),
    StoreRouterConnectingModule
  ],
  declarations: []
})
export class RootStoreModule { }
