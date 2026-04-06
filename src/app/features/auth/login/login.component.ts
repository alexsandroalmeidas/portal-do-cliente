import { AuthStoreActions } from '@/root-store/auth-store';
import { AppState } from '@/root-store/state';
import { SharedModule } from '@/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>,
  ) {}

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.store$.dispatch(
      new AuthStoreActions.SignInAction({
        user: email,
        password: password,
      }),
    );
  }
}
