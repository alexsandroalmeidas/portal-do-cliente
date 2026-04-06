import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MfaStoreEffects } from './mfa.effects';
import { featureReducer } from './mfa.reducer';
import { MfaService } from './mfa.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("mfa", featureReducer),
    EffectsModule.forFeature([MfaStoreEffects])
  ],
  providers: [
    MfaStoreEffects,
    MfaService
  ]
})
export class MfaStoreModule { }
