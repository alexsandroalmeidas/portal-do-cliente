import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { StepperComponent } from '../../../../../../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-mfa-two-factor-sms',
  templateUrl: './mfa-two-factor-sms.component.html',
  styleUrls: ['./mfa-two-factor-sms.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent
  ],
})
export class MfaTwoFactorSmsComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  buttonResendDisabled = true;
  buttonConfirmDisabled = true;
  display = 'Reenviar código em 02:00';
  public timerInterval: any;
  pinCode: string = '';
  @Input() phoneNumber: string = '';
  @Input() isVerify: boolean = false;
  @Input() isScheduled: boolean = false;
  @Input() isActivation: boolean = false;
  @Input() codeError = null as any;
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

  constructor() {
  }

  ngOnInit(): void {
    this.startTimer(2);
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onContinueClick(): void {
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
