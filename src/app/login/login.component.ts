import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Servicio de autenticación que crearás

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Si el login es exitoso, redirigir al home o alguna otra ruta
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error en el login', error);
        // Mostrar algún mensaje de error en la UI
      }
    );
  }
}
