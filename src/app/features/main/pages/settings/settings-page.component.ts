import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SettingsStoreActions, SettingsStoreSelectors } from './../../../../root-store';
import { AppState } from './../../../../root-store/state';
import { Language } from './../../../../shared/models/settings';
import { SharedModule } from './../../../../shared/shared.module';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

@Component({
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  standalone: true,
  imports: [
    ThemeSelectorComponent,
    SharedModule
  ],
})
export class SettingsPageComponent {

  languages: { value: Language; name: string; }[] = [
    { value: 'pt-BR', name: 'app.settings.language.pt-BR' },
    { value: 'en', name: 'app.settings.language.en' },
  ];

  language$: Observable<string>;

  constructor(private store$: Store<AppState>) {
    this.language$ = this.store$.pipe(select(SettingsStoreSelectors.selectLanguage));
  }

  onLanguageSelect(language: Language) {
    this.store$.dispatch(new SettingsStoreActions.ChangeLanguageAction({ language }));
  }

}
