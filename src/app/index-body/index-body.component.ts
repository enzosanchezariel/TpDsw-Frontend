import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importar RouterModule y Router
import { ProductGridComponent } from "../product-grid/product-grid.component";
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-index-body',
  standalone: true,
  imports: [ProductGridComponent, RouterModule, CommonModule],  // Asegúrate de importar RouterModule aquí
  templateUrl: './index-body.component.html',
  styleUrls: ['./index-body.component.scss']  // Cambié 'styleUrl' por 'styleUrls'
})
export class IndexBodyComponent {

  constructor(private router: Router, private authService: AuthService, private service: ProductsService) {}  // Inyectar el servicio Router

  canViewEmployee: boolean = false;
  canViewAdmin: boolean = false;
  cards: Product[] = [];

  ngOnInit(): void {
    if(localStorage.getItem('access_token') === null) {
      this.canViewEmployee = false;
    }
    this.canViewEmployee = this.authService.getRole() === 'admin' || this.authService.getRole() === 'empleado';
    this.loadAllProducts()
  }

  navigateToCreateProduct(): void {
    this.router.navigate(['/create-product']);  // Método de navegación
  }

  loadAllProducts() {
    this.service.getAllProducts().subscribe((response) => this.cards = response.data)
  }
}
