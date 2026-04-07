import { MedalliaService } from '@/shared/services/medallia.service';
import { Component, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidenavService } from 'src/app/features/mobile/services/sidenav.service';
import { ToolbarService } from 'src/app/features/mobile/services/toolbar.service';
import { AppState } from 'src/app/root-store/state';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MobileBasePage } from '../../pages/mobile-base.page';

@Component({
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './failure-page.component.html',
  styleUrls: ['./failure-page.component.scss']
})
export class FailureMobilePageComponent extends MobileBasePage {

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    medalliaService: MedalliaService,
    router: Router) {

    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);
  }

  ngOnInit() {
  }
}