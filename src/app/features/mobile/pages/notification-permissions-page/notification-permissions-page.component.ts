import { environment } from '@/environments/environment';
import { AuthStoreSelectors } from '@/root-store/auth-store';
import {
  CommunicationStoreActions,
  CommunicationStoreSelectors
} from '@/root-store/communication-store';
import { AppState } from '@/root-store/state';
import { MedalliaService } from '@/shared/services/medallia.service';
import { NavigationService } from '@/shared/services/navigation.service';
import { PushService } from '@/shared/services/push.service';
import { SharedModule } from '@/shared/shared.module';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import { exhaustMap, from, map, takeUntil } from 'rxjs';
import { ToolbarBackgroundComponent } from '../../components/toolbar-background/toolbar-background.component';
import { SidenavService } from '../../services/sidenav.service';
import { ToolbarService } from '../../services/toolbar.service';
import { MobileBasePage } from '../mobile-base.page';
import { NotificationPermissionForm } from './notification-permissions.forms';

@Component({
  standalone: true,
  imports: [SharedModule, ToolbarBackgroundComponent],
  templateUrl: './notification-permissions-page.component.html',
  styleUrls: ['./notification-permissions-page.component.scss']
})
export class NotificationPermissionsPageComponent
  extends MobileBasePage
  implements OnInit, AfterViewInit
{
  user?: string;
  subscription: PushSubscription | null = null;
  form = this.fb.group<NotificationPermissionForm>({
    enabled: this.fb.control(false, [Validators.required])
  });

  @ViewChild('buttonSubscriber') buttonSubscriber!: ElementRef<HTMLElement>;

  constructor(
    store$: Store<AppState>,
    bottomSheet: MatBottomSheet,
    viewContainerRef: ViewContainerRef,
    navigationService: NavigationService,
    toolbarService: ToolbarService,
    sidenavService: SidenavService,
    router: Router,
    private fb: FormBuilder,
    private swPush: SwPush,
    private pushService: PushService,
    medalliaService: MedalliaService
  ) {
    super(
      store$,
      bottomSheet,
      viewContainerRef,
      navigationService,
      sidenavService,
      toolbarService,
      medalliaService,
      router
    );
  }

  ngOnInit(): void {
    this.store$
      .pipe(
        takeUntil(this.$unsub),
        select(CommunicationStoreSelectors.selectPushNotificationSettings)
      )
      .subscribe({
        next: ({ enabled, subscription }) => {
          this.subscription = subscription;

          this.form.patchValue({
            enabled: enabled
          });
        }
      });

    this.store$.pipe(takeUntil(this.$unsub), select(AuthStoreSelectors.selectAuthData)).subscribe({
      next: (authData) => {
        this.user = authData?.user?.email;
      }
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (!this.swPush.isEnabled) {
      return;
    }

    this.buttonSubscriber.nativeElement.addEventListener('change', (evt) => {
      const enabled = this.form.controls.enabled.value;

      if (enabled) {
        this.store$.dispatch(new CommunicationStoreActions.EnablePushNotificationsAction());

        from(
          this.swPush.requestSubscription({
            serverPublicKey: environment.pushNotificationsPublicKey
          })
        )
          .pipe(
            takeUntil(this.$unsub),
            exhaustMap((subscription) =>
              this.pushService.subscribe(this.user!, subscription).pipe(map(() => subscription))
            )
          )
          .subscribe({
            next: () => console.log('Successufully subscribed to push notifications'),
            error: (err: HttpErrorResponse) => console.log(err.error)
          });

        return;
      }

      this.store$.dispatch(new CommunicationStoreActions.DisablePushNotificationsAction());

      from(this.swPush.unsubscribe())
        .pipe(
          takeUntil(this.$unsub),
          exhaustMap((subscription) => this.pushService.unsubscribe(this.subscription!.endpoint))
        )
        .subscribe({
          next: () => console.log('Successufully unsubscribed to push notifications'),
          error: (err: HttpErrorResponse) => console.log(err.error)
        });
    });
  }
}
