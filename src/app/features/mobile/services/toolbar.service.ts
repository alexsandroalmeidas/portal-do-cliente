import { Portal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  public portal!: Portal<any>;

  setPortal(portal: Portal<any>) {
    this.portal = portal;
  }
}
