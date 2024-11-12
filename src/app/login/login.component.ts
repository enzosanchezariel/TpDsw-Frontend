import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Servicio de autenticación que crearás
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    const loginData = this.loginForm.value;

    if (!loginData.email || !loginData.password) {
      alert('Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    this.authService.login(loginData.email, loginData.password).subscribe(
      response => {
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error al iniciar sesión:', error);
            if (error.error && error.error.message) {
              alert('Error al iniciar sesión: ' + error.error.message);
            } else {
              alert('Error al iniciar sesión. Por favor, inténtelo nuevamente.');
            }
      }
    );
  }
}
