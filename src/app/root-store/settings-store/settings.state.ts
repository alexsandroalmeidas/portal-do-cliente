import { Language } from './../../shared/models/settings';

export interface SettingsState {
  language: Language
}

export const initialState: SettingsState = {
  language: 'pt-BR'
};
