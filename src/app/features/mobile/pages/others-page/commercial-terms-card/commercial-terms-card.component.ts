import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-others-commercial-terms-card',
  standalone: true,
  templateUrl: './commercial-terms-card.component.html',
  styleUrls: ['./commercial-terms-card.component.scss'],
  imports: [
    SharedModule
  ],
})
export class CommercialTermsCardComponent implements OnInit {

  constructor(
    protected bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  async goToCommercialTerms() {
    await this.router.navigate(['/commercial-terms/mobile']);
  }
}