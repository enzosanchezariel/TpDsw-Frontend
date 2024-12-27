import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../entities/user.entity';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: string[] = ['cliente', 'empleado', 'admin'];
  isLoading: boolean = true;
  searchQuery: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data;
        this.filteredUsers = this.users;  // Inicializar la lista filtrada
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.isLoading = false;
      }
    );
  }

  filterUsers(): void {
    if (this.searchQuery.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;  // Si no hay búsqueda, mostrar todos
    }
  }

  changeRole(user: User): void {
    const updatedUser = { ...user, role: user.role };

    this.userService.updateUserData(user.email, updatedUser).subscribe(
      (response) => {
        alert('Rol actualizado con éxito');
        this.loadUsers();  // Recargar la lista de usuarios
      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
        alert('Error al actualizar el rol');
      }
    );
  }
}
