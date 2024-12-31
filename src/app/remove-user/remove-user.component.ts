import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

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
  confirmMessage: string = '';
  isConfirmed: boolean = false;
  showDeleteConfirmation: boolean = false;
  confirmationMessage: boolean = false;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  // Mostrar mensaje de confirmación de eliminación
  showConfirmation(): void {
    if (this.password === this.confirmPassword) {
      this.isConfirmed = true;
      this.confirmMessage = '¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede deshacer.';
      this.showDeleteConfirmation = true; // Mostrar la pregunta de confirmación
    } else {
      this.errorMessage = 'Las contraseñas no coinciden.';
    }
  }

  // Confirmar eliminación de cuenta
  confirmDelete(): void {
    // Llamada al servicio para eliminar el usuario
    this.userService.removeUser(this.email).subscribe(
      () => {
        this.confirmationMessage = true; // Muestra el modal de confirmación de eliminación
        this.authService.logout();
        localStorage.clear();
      },
      (error) => {
        this.errorMessage = 'Ocurrió un error al eliminar el usuario: ' + error.message;
      }
    );
  }

  // Redirigir al inicio después de la eliminación
  redirectToHome(): void {
    this.confirmationMessage = false; // Ocultar el modal de confirmación
    this.router.navigate(['/home']); // Redirige al inicio
  }
}
