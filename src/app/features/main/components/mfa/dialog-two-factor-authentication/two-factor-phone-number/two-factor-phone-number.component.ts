import { StepperComponent } from '@/shared/components/stepper/stepper.component';
import { SharedModule } from '@/shared/shared.module';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-two-factor-phone-number',
  templateUrl: './two-factor-phone-number.component.html',
  styleUrls: ['./two-factor-phone-number.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    StepperComponent
  ],
})
export class TwoFactorPhoneNumberComponent implements OnInit, OnDestroy {

  private $unsub = new Subject();
  form!: UntypedFormGroup;
  @Output() continue = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<boolean>();

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
