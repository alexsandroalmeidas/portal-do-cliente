import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Language } from './../../shared/models/settings';
import { SettingsState } from './settings.state';

export const selectSettings: MemoizedSelector<object, SettingsState> = createFeatureSelector<SettingsState>('settings');

export const selectLanguage: MemoizedSelector<object, Language> = createSelector(
  selectSettings,
  (state: SettingsState): Language => state.language
);
