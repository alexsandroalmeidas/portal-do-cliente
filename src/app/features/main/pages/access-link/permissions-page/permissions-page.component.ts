import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { BasePage } from '../../base.page';
import { AppState } from './../../../../../root-store/state';
import { SharedModule } from './../../../../../shared/shared.module';
import { PermissionsGroup } from './permissions-page-model';

@Component({
  templateUrl: './permissions-page.component.html',
  styleUrls: ['./permissions-page.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class PermissionsPageComponent extends BasePage implements OnInit, OnDestroy {
  private $destroy = new Subject<void>();
  private roleId!: string;

  permissions: PermissionsGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    store$: Store<AppState>,
    navigationService: NavigationService) {
    super(store$, navigationService);
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.params['roleId'];
  }
}
