// src/app/components/remove-user/remove-user.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.scss']
})
export class RemoveUserComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  confirmMessage: string = '';
  isConfirmed: boolean = false;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  // Método para mostrar mensaje de confirmación
  showConfirmation(): void {
    if (this.password === this.confirmPassword) {
      this.isConfirmed = true;
      this.confirmMessage = '¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede deshacer.';
    } else {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.successMessage = '';
    }
  }

removeUser(): void {
  // Limpiar mensajes previos al iniciar la eliminación
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.password || !this.confirmPassword) {
    this.errorMessage = 'Por favor, ingrese la contraseña dos veces para confirmar.';
    return;
  }

  if (this.isConfirmed) {
    // Llamada al servicio para eliminar el usuario
    this.userService.removeUser(this.email).subscribe(
      () => {
        alert('Usuario eliminado exitosamente.');
        this.router.navigate(['/home']);
        localStorage.clear();
        this.authService.logout();
      },
      (error) => {
        // Si ocurre un error, muestra el mensaje de error
        this.errorMessage = 'Ocurrió un error al eliminar el usuario: ' + error.message;
        this.successMessage = '';
      }
    );
  } else {
    this.errorMessage = 'Por favor, confirme la eliminación ingresando la contraseña correctamente.';
  }
}
}