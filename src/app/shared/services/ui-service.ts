import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UiService {

  spin$: Subject<boolean> = new Subject();

  constructor() { }

  showSpinner() {
  }

  stopSpinner() {
  }

}
