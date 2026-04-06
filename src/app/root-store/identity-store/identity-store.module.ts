import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IdentityStoreEffects } from './identity.effects';
import { featureReducer } from './identity.reducer';
import { IdentityService } from './identity.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('identity', featureReducer),
    EffectsModule.forFeature([IdentityStoreEffects])
  ],
  providers: [
    IdentityStoreEffects,
    IdentityService
  ]
})
export class IdentityStoreModule { }
