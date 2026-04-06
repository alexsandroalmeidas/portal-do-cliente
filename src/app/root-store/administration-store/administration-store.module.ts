import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AdministrationStoreEffects } from './administration.effects';
import { featureReducer } from './administration.reducer';
import { AdministrationService } from './administration.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("administration", featureReducer),
    EffectsModule.forFeature([AdministrationStoreEffects])
  ],
  providers: [
    AdministrationStoreEffects,
    AdministrationService
  ]
})
export class AdministrationStoreModule { }
