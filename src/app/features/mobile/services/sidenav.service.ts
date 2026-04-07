import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private panel!: MatSidenav;
  private vcf!: ViewContainerRef;

  setSidenav(sidenav: MatSidenav) {
    this.panel = sidenav;
  }

  setContentVcf(viewContainerRef: ViewContainerRef) {
    this.vcf = viewContainerRef;
  }

  open(template: TemplateRef<any>) {
    this.createView(template);
    return this.panel.open();
  }

  close() {
    return this.panel.close();
  }

  toggle() {
    return this.panel.toggle();
  }

  private createView(template: TemplateRef<any>) {
    this.vcf.clear();
    this.vcf.createEmbeddedView(template);
  }
}
