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
  showModal: boolean = false;
  showSuccessModal: boolean = false; // Variable para mostrar el modal de éxito
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response.data;
        this.filteredUsers = this.users;
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
      this.filteredUsers = this.users;
    }
  }

  openConfirmationModal(user: User): void {
    this.selectedUser = { ...user }; // Clonar el usuario para evitar modificar el original antes de confirmar
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.loadUsers(); // Recargar los usuarios después de confirmar el cambio
  }

  confirmRoleChange(): void {
    if (this.selectedUser) {
      this.userService.updateUserData(this.selectedUser.email, this.selectedUser).subscribe(
        (response) => {
          // Mostrar el modal de éxito
          this.showModal = false; // Cerrar el modal de confirmación
          this.showSuccessModal = true; // Mostrar el modal de éxito
        },
        (error) => {
          console.error('Error al actualizar el rol:', error);
          alert('Error al actualizar el rol');
        }
      );
    }
  }
}
