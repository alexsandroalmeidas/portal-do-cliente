import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others-notifications-card',
  standalone: true,
  templateUrl: './notifications-card.component.html',
  styleUrls: ['./notifications-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class NotificationsCardComponent implements OnInit {

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToNotifications() {
    await this.router.navigate(['/notifications/mobile']);
  }
}