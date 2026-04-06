import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReportsStoreEffects } from './reports.effects';
import { featureReducer } from './reports.reducer';
import { ReportsService } from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("reports", featureReducer),
    EffectsModule.forFeature([ReportsStoreEffects])
  ],
  providers: [
    ReportsStoreEffects,
    ReportsService
  ]
})
export class ReportsStoreModule { }
