import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoreStoreEffects } from './core.effects';
import { featureReducer } from './core.reducer';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('core', featureReducer),
    EffectsModule.forFeature([CoreStoreEffects])
  ],
  providers: [CoreStoreEffects]
})
export class CoreStoreModule { }
