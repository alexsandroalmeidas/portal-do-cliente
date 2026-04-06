import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PrepaymentsStoreEffects } from './prepayments.effects';
import { featureReducer } from './prepayments.reducer';
import { PrepaymentsService } from './prepayments.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("prepayments", featureReducer),
    EffectsModule.forFeature([PrepaymentsStoreEffects])
  ],
  providers: [
    PrepaymentsStoreEffects,
    PrepaymentsService
  ]
})
export class PrepaymentsStoreModule { }
