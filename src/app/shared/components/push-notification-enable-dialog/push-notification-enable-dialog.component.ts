import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwPush } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { exhaustMap, from, map, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommunicationStoreActions } from '../../../root-store/communication-store';
import { AppState } from '../../../root-store/state';
import { PushService } from '../../services/push.service';
import { SharedModule } from '../../shared.module';
import { PushNotificationEnableData } from './push-notification-enable-data';
import { PushNotificationEnableResult } from './push-notification-enable-result';

@Component({
  templateUrl: './push-notification-enable-dialog.component.html',
  styleUrls: ['./push-notification-enable-dialog.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class PushNotificationEnableDialogComponent implements AfterViewInit, OnDestroy {

  private $unsub = new Subject();

  @ViewChild('buttonSubscriber') buttonSubscriber!: ElementRef<HTMLElement>;

  constructor(
    private dialogRef: MatDialogRef<PushNotificationEnableDialogComponent, PushNotificationEnableResult>,
    @Inject(MAT_DIALOG_DATA) private data: PushNotificationEnableData,
    private store$: Store<AppState>,
    private swPush: SwPush,
    private pushService: PushService) {
  }

  ngAfterViewInit(): void {
    this.buttonSubscriber.nativeElement.addEventListener('click', () => {
      from(this.swPush.requestSubscription({ serverPublicKey: environment.pushNotificationsPublicKey }))
        .pipe(
          takeUntil(this.$unsub), exhaustMap((subscription) =>
            this.pushService.subscribe(this.data.user, subscription)
              .pipe(map(() => subscription))
          )
        )
        .subscribe({
          next: (subscription) => {
            this.store$.dispatch(new CommunicationStoreActions.EnablePushNotificationsAction());
            this.dialogRef.close({ isSucceded: true });
          },
          error: (err: HttpErrorResponse) => { this.dialogRef.close({ isSucceded: false, error: err.error }) }
        });
    });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancel() {
    this.store$.dispatch(new CommunicationStoreActions.DisablePushNotificationsAction());
    this.dialogRef.close();
  }

}
