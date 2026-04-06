import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoggingService } from 'src/app/shared/services/logging.service';
import { AuthStoreEffects } from './auth.effects';
import { featureReducer } from './auth.reducer';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', featureReducer),
    EffectsModule.forFeature([AuthStoreEffects]),
  ],
  providers: [AuthStoreEffects, AuthService, LoggingService],
})
export class AuthStoreModule { }
