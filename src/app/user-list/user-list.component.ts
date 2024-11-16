import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';  // Asegúrate de que el servicio exista
import { User } from '../../entities/user.entity';  // Asume que tienes una entidad User

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];  // Lista de usuarios a mostrar
  roles: string[] = ['cliente', 'empleado', 'admin'];  // Los roles posibles
  isLoading: boolean = true;  // Para mostrar un cargador mientras se obtienen los usuarios

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar los usuarios desde el backend
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data;  // Asegúrate de que la respuesta esté estructurada de esta manera
        this.isLoading = false;  // Deja de mostrar el cargador
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.isLoading = false;
      }
    );
  }

  // Cambiar el rol de un usuario
  changeRole(user: User): void {
    const updatedUser = { ...user, role: user.role };  // Aquí actualizamos solo el rol

    this.userService.updateUserData(user.email, updatedUser).subscribe(
      (response) => {
        alert('Rol actualizado con éxito');
        this.loadUsers();  // Recargar la lista de usuarios para mostrar los cambios
      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
        alert('Error al actualizar el rol');
      }
    );
  }
}
