import { Action } from '@ngrx/store';
import { Language } from './../../shared/models/settings';

export enum ActionTypes {
  CHANGE_LANGUAGE = '@app/settings/change-language',
}

export class ChangeLanguageAction implements Action {
  readonly type = ActionTypes.CHANGE_LANGUAGE;
  constructor(public payload: { language: Language; }) { }
}

export type Actions =
  ChangeLanguageAction;
