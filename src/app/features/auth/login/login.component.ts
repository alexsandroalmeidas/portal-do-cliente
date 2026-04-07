import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '@/root-store/state';
import { AuthStoreActions } from '@/root-store/auth-store';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppState>,
  ) {}

  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  // 🔐 REGEX FORTE
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(this.passwordRegex)],
    ],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Preencha corretamente os campos';
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isLoading = true;

    setTimeout(() => {
      try {
        const isMarcelo =
          email === 'marcelo@tinotech.com.br' && password === 'Petlove@2026';

        const isAlexsandro =
          email === 'alexsandro@tinotech.com.br' && password === 'Petlove@2026';

        if (!isMarcelo && !isAlexsandro) {
          throw { status: 401 };
        }

        this.store$.dispatch(
          new AuthStoreActions.SignInAction({
            user: email,
            password: password,
          }),
        );

        this.isLoading = false;
      } catch (err: any) {
        this.isLoading = false;
        this.handleError(err);
      }
    }, 1000);
  }

  private handleError(err: any) {
    if (!err || !err.status) {
      this.errorMessage = 'Erro inesperado. Tente novamente';
      return;
    }

    switch (err.status) {
      case 401:
        this.errorMessage = 'Email ou senha inválidos';
        break;
      case 403:
        this.errorMessage = 'Usuário sem permissão';
        break;
      case 0:
        this.errorMessage = 'Sem conexão com a internet';
        break;
      default:
        this.errorMessage =
          err.status >= 500
            ? 'Erro no servidor. Tente novamente mais tarde'
            : 'Erro ao realizar login';
    }
  }

  // 🔎 HELPERS PARA TEMPLATE
  get passwordControl(): AbstractControl {
    return this.form.controls.password;
  }

  hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  hasNumber(password: string): boolean {
    return /\d/.test(password);
  }

  hasSpecialChar(password: string): boolean {
    return /[\W_]/.test(password);
  }
}
