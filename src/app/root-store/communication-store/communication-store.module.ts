import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommunicationStoreEffects } from './communication.effects';
import { featureReducer } from './communication.reducer';
import { CommunicationService } from './communication.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature("communication", featureReducer),
    EffectsModule.forFeature([CommunicationStoreEffects])
  ],
  providers: [
    CommunicationStoreEffects,
    CommunicationService
  ]
})
export class CommunicationStoreModule { }
