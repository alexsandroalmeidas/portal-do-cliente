import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Store } from '@ngrx/store';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { Subject, takeUntil } from 'rxjs';
import { AuthStoreActions, AuthStoreSelectors } from './root-store';
import { CommunicationStoreActions } from './root-store/communication-store';
import { AppState } from './root-store/state';
import { SecurityService } from './shared/services/security.service';

async function getFingerprint() {
  // Inicia a coleta de dados do navegador
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  if (environment.production) {
    console.log('Fingerprint:', result.visitorId); // Apenas em desenvolvimento
  }

  // Exibe o identificador único (fingerprint)
  console.log(result.visitorId);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, NgxUiLoaderModule, CommonModule],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private $unsub = new Subject();

  get isPasswordRecovery() {
    return window.location.pathname === '/passwordrecovery';
  }

  get isSigninAd() {
    return window.location.pathname === '/signinAD';
  }

  constructor(
    private store$: Store<AppState>,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private securityService: SecurityService,
  ) {
    this.swUpdate.available.subscribe(() => {
      if (environment.production) {
        if (confirm('Nova versão disponível. Atualizar agora?')) {
          window.location.reload();
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await getFingerprint();

    if (this.securityService.isSuspiciousDevice()) {
      this.securityService.disableServiceWorker();
    }

    if (this.swPush.isEnabled) {
      this.swPush.messages.subscribe({
        next: (message) => {
          this.store$.dispatch(
            new CommunicationStoreActions.ListNotificationsAction(),
          );
        },
      });
    }

    // if (environment.production) {
    //   this.disableDebugging();
    // }
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  ngAfterViewInit(): void {
    this.store$
      .select(AuthStoreSelectors.selectIsAuthenticated)
      .pipe(takeUntil(this.$unsub))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.store$.dispatch(new AuthStoreActions.InitializeSessionAction());
        }
      });

    // this.store$
    //   .select(AuthStoreSelectors.selectAuthorizationCode)
    //   .pipe(takeUntil(this.$unsub))
    //   .subscribe((authorizationCode) => {
    //     if (this.isPasswordRecovery || this.isSigninAd) {
    //       this.store$.dispatch(new AuthStoreActions.InitializeSessionAction());
    //       return;
    //     }
    //     const params = new URLSearchParams(window.location.search);
    //     const isAd = params?.get('ad');
    //     const authCode = params?.get('code');
    //     if (!!authCode) {
    //       if ((this.isSigninAd && !!authorizationCode) || (!!isAd && !!authCode)) {
    //         this.store$.dispatch(
    //           new AuthStoreActions.InitializeAdSessionAction({ authorizationCode: authCode ?? '' })
    //         );
    //         return;
    //       }
    //       if (!!authorizationCode && authCode === authorizationCode) {
    //         this.store$.dispatch(new AuthStoreActions.InitializeSessionAction());
    //         return;
    //       }
    //       this.store$.dispatch(new AuthStoreActions.SignInAction({ authorizationCode: authCode }));
    //       return;
    //     }
    //     if (!!authorizationCode) {
    //       const isAd = authorizationCode.slice(0, 3) === 'AD-';
    //       if (isAd) {
    //         this.store$.dispatch(
    //           new AuthStoreActions.InitializeAdSessionAction({
    //             authorizationCode: authorizationCode.slice(3, authorizationCode.length - 3) ?? ''
    //           })
    //         );
    //       } else {
    //         this.store$.dispatch(new AuthStoreActions.InitializeSessionAction());
    //       }
    //       return;
    //     }
    //     console.log(`SignOutAction: app.component.ts:100`);
    //     this.store$.dispatch(new AuthStoreActions.SignOutAction());
    //     return;
    //   });
  }

  disableDebugging() {
    // Bloqueia F12, Ctrl+Shift+I e botão direito
    document.addEventListener('keydown', (event) => {
      if (
        event.keyCode === 123 ||
        (event.ctrlKey && event.shiftKey && event.keyCode === 73)
      ) {
        event.preventDefault();
      }
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    // Monitora abertura do DevTools
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > 100 ||
        window.outerWidth - window.innerWidth > 100
      ) {
        alert('Ferramentas de desenvolvedor detectadas! Acesso restrito.');
        window.location.href = '/error'; // Ou redirecionar para uma página de erro
      }
    }, 1000);
  }
}
