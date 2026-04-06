import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../../../root-store/state';
import { SharedModule } from './../../../../shared/shared.module';
import { BannersPageComponent } from './banners-page/banners-page.component';
import { MessagesPageComponent } from './messages-page/messages-page.component';
import { BasePage } from '../base.page';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  templateUrl: './communication-page.component.html',
  styleUrls: ['./communication-page.component.scss'],
  standalone: true,
  imports: [
    BannersPageComponent,
    MessagesPageComponent,
    SharedModule],
})
export class CommunicationPageComponent extends BasePage implements OnInit, OnDestroy {

  activeTabIndex = 0;

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService) {
    super(store$, navigationService);
  }

  ngOnInit(): void {
  }
}
