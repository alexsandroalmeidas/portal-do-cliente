import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { StepperComponent } from '../../../../../../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-mfa-two-factor-phone-number',
  templateUrl: './mfa-two-factor-phone-number.component.html',
  styleUrls: ['./mfa-two-factor-phone-number.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent
  ],
})
export class MfaTwoFactorPhoneNumberComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();

  @Input() isVerify: boolean = false;
  @Input() isActivation: boolean = false;
  @Output() continue = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<boolean>();

  form!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      phoneNumber: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onCancelClick(): void {
    this.cancel.next(true);
  }

  onContinueClick() {

    if (this.form.invalid) {
      return;
    }

    const form = this.form.getRawValue();
    const { phoneNumber } = form;

    this.continue.next(phoneNumber);
  }
}
