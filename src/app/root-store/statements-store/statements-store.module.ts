import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StatementsStoreEffects } from './statements.effects';
import { featureReducer } from './statements.reducer';
import { StatementsService } from './statements.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('statements', featureReducer),
    EffectsModule.forFeature([StatementsStoreEffects])
  ],
  providers: [
    StatementsStoreEffects,
    StatementsService
  ]
})
export class StatementsStoreModule { }
