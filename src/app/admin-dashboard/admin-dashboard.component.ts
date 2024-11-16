import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
   constructor(private router: Router) {}

  // Método para redirigir al formulario de creación de categoría
  navigateToCategoryCRUD() {
    this.router.navigate(['/crud-category']);
  }

  navigateToProductCRUD() {
    this.router.navigate(['/crud-product']);
  }

  navigateToDiscountCRUD() {
    this.router.navigate(['/crud-discount']);
  }

  navegateToUsersRoles() {
    this.router.navigate(['/user-list']);
  }

  navegateToDeliveries() {
    this.router.navigate(['/delivery-list']);
  }
}
