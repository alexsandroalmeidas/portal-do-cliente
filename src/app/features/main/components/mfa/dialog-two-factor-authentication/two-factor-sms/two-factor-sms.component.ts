import { StepperComponent } from '@/shared/components/stepper/stepper.component';
import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-two-factor-sms',
  templateUrl: './two-factor-sms.component.html',
  styleUrls: ['./two-factor-sms.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent
  ],
})
export class TwoFactorSmsComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  buttonResendDisabled = true;
  buttonConfirmDisabled = true;
  display = 'Reenviar código em 02:00';
  public timerInterval: any;
  pinCode: string = '';
  @Input() phoneNumber: string = '';
  @Input() isVerify: boolean = false;
  @Input() isScheduled: boolean = false;
  @Output() confirmSms = new EventEmitter<string>();
  @Output() resendSms = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

  getPhoneNumber() {

    if (!!this.phoneNumber) {
      const dddPhone = this.phoneNumber.substring(0, 2);
      const justPhoneBegin = this.phoneNumber.substring(2, 3);
      const justPhoneStart = this.phoneNumber.substring(3, 7);
      const justPhoneEnd = this.phoneNumber.substring(7, this.phoneNumber.length);

      return `(${dddPhone}) ${justPhoneBegin}${justPhoneStart.replace(/[0-9]/g, '*')}${justPhoneEnd}`;
    }

    return '';
  }

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.phoneNumber = data.phoneNumber
  }

  ngOnInit(): void {
    this.startTimer(2);
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onConfirmClick(): void {
    this.confirmSms.next(this.pinCode);
  }

  onCancelClick(): void {
    this.cancel.next(true);
  }

  onCodeCompleted(code: string): void {
    this.pinCode = code;
    this.buttonConfirmDisabled = !!!code;
  }

  onResendClick(): void {
    this.buttonResendDisabled = true;
    this.startTimer(2);
    this.resendSms.next(true);
  }

  startTimer(minute: any) {

    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `Reenviar código em: ${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(this.timerInterval);

        this.buttonResendDisabled = false;
        this.display = `Reenviar código`;
      }
    }, 1000);
  }
}
