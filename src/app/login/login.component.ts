import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  showErrorModal = false; // Propiedad para manejar el modal de error

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  onSubmit() {
    const loginData = this.loginForm.value;

    if (!loginData.email || !loginData.password) {
      this.errorMessage = 'Por favor, ingrese su correo electrónico y contraseña.';
      this.showErrorModal = true;
      return;
    }

    this.authService.login(loginData.email, loginData.password).subscribe(
      response => {
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, inténtelo nuevamente.';
        this.showErrorModal = true;
      }
    );
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = null;
  }
}
