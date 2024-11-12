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
  navigateToCategoryCreation() {
    this.router.navigate(['/create-category']);
  }

  navigateToProductCreation() {
    this.router.navigate(['/create-product']);
  }
}
