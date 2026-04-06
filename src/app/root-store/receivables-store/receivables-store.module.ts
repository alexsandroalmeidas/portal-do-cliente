import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReceivablesStoreEffects } from './receivables.effects';
import { featureReducer } from './receivables.reducer';
import { ReceivablesService } from './receivables.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('receivables', featureReducer),
    EffectsModule.forFeature([ReceivablesStoreEffects])
  ],
  providers: [
    ReceivablesStoreEffects,
    ReceivablesService
  ]
})
export class ReceivablesStoreModule { }
