import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SettingsStoreEffects } from './settings.effects';
import { featureReducer } from './settings.reducer';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('settings', featureReducer),
    EffectsModule.forFeature([SettingsStoreEffects])
  ],
  providers: [SettingsStoreEffects]
})
export class SettingsStoreModule { }
