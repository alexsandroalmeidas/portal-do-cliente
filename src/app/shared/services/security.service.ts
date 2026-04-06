import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  isSuspiciousDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();

    // Detecta navegadores emulados ou suspeitos
    const suspiciousAgents = [
      'headless', 'phantomjs', 'selenium', 'node.js', 'bot', 'crawler', 'spider'
    ];

    if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
      return true;
    }

    // Detecta se DevTools está aberto
    const threshold = 160;
    const isEmulatedMobile = window.devicePixelRatio > 1 && window.innerWidth < 800;
    const devtoolsOpened = !isEmulatedMobile && (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold ||
      (window.outerHeight === screen.height && window.outerWidth === screen.width)
    );

    if (devtoolsOpened) {
      return true;
    }

    return false;
  }

  disableServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
        console.warn('🚨 Service Worker desativado devido a um dispositivo suspeito!');
      });
    } else {
      console.log('Service Worker não suportado neste navegador.');
    }
  }
}
