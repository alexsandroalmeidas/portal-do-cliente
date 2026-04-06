import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SalesStoreEffects } from './sales.effects';
import { featureReducer } from './sales.reducer';
import { SalesService } from './sales.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("sales", featureReducer),
    EffectsModule.forFeature([SalesStoreEffects])
  ],
  providers: [
    SalesStoreEffects,
    SalesService
  ]
})
export class SalesStoreModule { }
