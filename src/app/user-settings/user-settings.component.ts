import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../../entities/user.entity';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  userForm: FormGroup;
  originalUser: User | null = null;
  userEmail: string = '';
  public errorMessage: string | null = null; // Para los mensajes de error
  public successModalVisible: boolean = false; // Control del modal de éxito

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      token_id: [''],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Solo letras y espacios
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]], // Solo letras y espacios
      email: ['', [Validators.required, Validators.email]], // Email válido
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números
      address: ['', Validators.required], // Obligatorio
      password: [''], // Campo de contraseña para permitir cambios
      newPassword: [''], // Campo opcional para nueva contraseña
      role: [''],
    });
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail()!;
    if (this.userEmail) {
      this.userService.getUserData(this.userEmail).subscribe(
        (response) => {
          this.originalUser = response.data;
          this.userForm.patchValue({
            token_id: this.originalUser?.token_id,
            dni: this.originalUser?.dni,
            name: this.originalUser?.name,
            last_name: this.originalUser?.last_name,
            email: this.originalUser?.email,
            phone: this.originalUser?.phone,
            address: this.originalUser?.address,
            password: this.originalUser?.password,
            role: this.originalUser?.role
          });
        },
        (error) => {
          this.handleError('Error al obtener los datos del usuario. Por favor, inténtelo nuevamente.');
        }
      );
    } else {
      this.handleError('No se encontró el correo electrónico del usuario.');
    }
  }

  onSubmit(): void {
    const missingFields = [];
    if (!this.userForm.value.dni) missingFields.push('DNI');
    if (!this.userForm.value.name) missingFields.push('Nombre');
    if (!this.userForm.value.last_name) missingFields.push('Apellido');
    if (!this.userForm.value.email) missingFields.push('Email');
    if (!this.userForm.value.phone) missingFields.push('Teléfono');
    if (!this.userForm.value.address) missingFields.push('Dirección');
    if (missingFields.length > 0) {
      this.handleError(`Por favor, complete los campos obligatorios: ${missingFields.join(', ')}`);
      return;
    }

    if (this.originalUser) {
      const updatedUser: User = {
        ...this.originalUser,
        ...this.userForm.value,
      };

      if (this.userForm.value.newPassword) {
        updatedUser.password = this.userForm.value.newPassword;
      }

      this.userService.updateUserData(this.originalUser.email, updatedUser).subscribe(
        (response) => {
          this.successModalVisible = true; // Mostrar el modal de éxito
        },
        (error) => {
          this.handleError('Error al actualizar los datos del usuario. Por favor, inténtelo nuevamente.');
        }
      );
    }
  }

  closeSuccessModal(): void {
    this.successModalVisible = false;
    this.router.navigate(['/home']); // Redirigir después de cerrar el modal
  }

  cancel(): void { 
    this.router.navigate(['/home']); // Redirigir al cancel
  }

  handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}
