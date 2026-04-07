import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-others-notifications-permission-card',
  standalone: true,
  templateUrl: './notifications-permission-card.component.html',
  styleUrls: ['./notifications-permission-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class NotificationsPermissionCardComponent implements OnInit {

  constructor(
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToNotificationPermissions() {
    await this.router.navigate(['/notification-permissions/mobile']);
  }
}
