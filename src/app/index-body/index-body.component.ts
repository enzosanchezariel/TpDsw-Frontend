import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';
import { ProductGridComponent } from "../product-grid/product-grid.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index-body',
  standalone: true,
  imports: [ProductGridComponent, RouterModule, CommonModule],
  templateUrl: './index-body.component.html',
  styleUrls: ['./index-body.component.scss']
})
export class IndexBodyComponent implements OnInit, OnDestroy {
  canViewEmployee: boolean = false;
  canViewAdmin: boolean = false;
  cards: Product[] = [];
  private authStatusSub: Subscription | undefined;
  private roleSub: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private service: ProductsService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación y rol
    this.authStatusSub = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.canViewEmployee = isAuthenticated && (this.authService.getRole() === 'admin' || this.authService.getRole() === 'empleado');
    });

    this.roleSub = this.authService.userRole$.subscribe(role => {
      this.canViewAdmin = role === 'admin';
    });

    // Cargar productos
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones para evitar fugas de memoria
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
    if (this.roleSub) {
      this.roleSub.unsubscribe();
    }
  }

  navigateToCreateProduct(): void {
    this.router.navigate(['/create-product']);
  }

  loadAllProducts() {
    this.service.getAllProducts().subscribe((response) => {
      this.cards = response.data;
    });
  }
}
