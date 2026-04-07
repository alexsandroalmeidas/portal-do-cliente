import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { StepperComponent } from '../../../../../../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-mfa-two-factor-email',
  templateUrl: './mfa-two-factor-email.component.html',
  styleUrls: ['./mfa-two-factor-email.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent
  ],
})
export class MfaTwoFactorEmailComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  buttonResendDisabled = true;
  buttonContinueDisabled = true;
  display = 'Reenviar código em 02:00';
  public timerInterval: any;
  pinCode: string = '';
  @Input() emailSelected: string = '';
  @Input() isVerify: boolean = false;
  @Input() isActivation: boolean = false;
  @Output() continue = new EventEmitter<string>();
  @Output() resendEmail = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

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
    this.continue.next(this.pinCode);
  }

  onCancelClick(): void {
    this.cancel.next(true);
  }

  onCodeCompleted(code: string): void {
    this.pinCode = code;
    this.buttonContinueDisabled = !!!code;
  }

  onResendClick(): void {
    this.buttonResendDisabled = true;
    this.startTimer(2);
    this.resendEmail.next(true);
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
