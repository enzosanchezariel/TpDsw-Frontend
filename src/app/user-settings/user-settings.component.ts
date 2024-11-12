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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      token_id: [''],
      dni: [''],
      name: [''],
      last_name: [''],
      email: [''],
      phone: [''],
      address: [''],
      password: [''],  // Campo de contraseña para permitir cambios
      newPassword: [''], // Campo opcional para nueva contraseña
      role: [''],
    });

  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail()!;
    console.log('Email del usuario:', this.userEmail);
    if (this.userEmail) {
      this.userService.getUserData(this.userEmail).subscribe((response) => {
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
      }, error => {
        console.error('Error al obtener los datos del usuario', error);
      });
    } else {
      // Si no se encuentra el email en los parámetros de la URL, redirigir o manejar el caso
      console.error('No se encontró el correo electrónico en la URL');
    }
  }

  onSubmit(): void {
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
          console.log('Usuario actualizado:', response);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error al actualizar los datos del usuario', error);
          alert('Error al actualizar los datos del usuario');
        }
      );
    }
  }


  cancel(): void {
    this.router.navigate(['/home']);
  }
}