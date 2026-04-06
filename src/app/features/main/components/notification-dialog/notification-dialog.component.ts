import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Notification } from './../../../../shared/models/core';
import { SharedModule } from './../../../../shared/shared.module';

@Component({
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class NotificationDialogComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();
  safeHtml!: SafeHtml;

  notification!: Notification;

  @Output() markRead = new EventEmitter<void>();
  @Output() markUnread = new EventEmitter<void>();

  constructor(
    private sanitizer: DomSanitizer,
    public bsModalRef: BsModalRef) {
  }


  ngOnInit() {
    this.markRead.next();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCloseClick() {
    this.bsModalRef.hide();
  }

  onMarkReadClick() {
    this.markRead.next();
    this.bsModalRef.hide();
  }

  onMarkUnreadClick() {
    this.markUnread.next();
    this.bsModalRef.hide();
  }

  byPassHTML() {

    if (!!this.notification) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.notification.text);
    }

    return this.safeHtml;
  }
}
