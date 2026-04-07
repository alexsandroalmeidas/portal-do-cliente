import { Notification } from '@/root-store/communication-store/communication.models';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { SharedModule } from '@/shared/shared.module';
import { AfterViewInit, Component, Input, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidenavService } from '../../../services/sidenav.service';
import { ToolbarService } from '../../../services/toolbar.service';
import { MobileBasePage } from '../../mobile-base.page';

@Component({
  selector: 'app-notifications-view',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './notifications-view-page.component.html',
  styleUrls: ['./notifications-view-page.component.scss']
})
export class NotificationsViewPageComponent extends MobileBasePage implements AfterViewInit {

  safeHtml!: SafeHtml;
  @Input() notificationView: Notification = null as any;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    medalliaService: MedalliaService) {

    super(store$, bottomSheet, viewContainerRef, navigationService, sidenavService, toolbarService, medalliaService, router);
  }

  ngOnInit() {
    this.byPassHTML(this.notificationView, true);
  }

  byPassHTML(notification: Notification, fullText: boolean = false): SafeHtml {

    let text = notification.text.length > 50 ? notification.text.slice(0, 50) + '...' : notification.text;

    if (fullText) {
      text = notification.text;
    }

    if (!!notification) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(text);
    }

    return this.safeHtml;
  }

  override ngAfterViewInit(): void {

    const link = document.getElementById('reports-link');

    if (!link) {
      console.error('Elemento com ID "reports-link" não encontrado.');
      return;
    }

    if (link) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Evento de clique capturado!');
        try {
          this.router.navigate(['reports/mobile']);
          console.log('Navegação concluída.');
        } catch (error) {
          console.error('Erro ao navegar:', error);
        }
      });
    }
  }
}
