import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Notification } from 'src/app/root-store/communication-store/communication.models';
import { AppState } from 'src/app/root-store/state';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasePage } from '../../base.page';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view-page.component.html',
  styleUrls: ['./notifications-view-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class NotificationsViewPageComponent extends BasePage implements OnInit, OnDestroy, AfterViewInit {

  @Input() notificationView: Notification = null as any;
  safeHtml!: SafeHtml;

  constructor(
    store$: Store<AppState>,
    navigationService: NavigationService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    protected router: Router) {

    super(store$, navigationService);
  }

  ngOnInit() {

    if (!!this.notificationView) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.notificationView.text);
    }
  }

  ngAfterViewInit(): void {

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
          this.router.navigate(['/reports']);
          console.log('Navegação concluída.');
        } catch (error) {
          console.error('Erro ao navegar:', error);
        }
      });
    }
  }
}