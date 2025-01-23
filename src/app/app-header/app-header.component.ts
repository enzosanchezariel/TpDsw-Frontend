import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // For ngModel binding
import { CommonModule } from '@angular/common';  // For ngIf, ngFor, etc.
import { RouterModule } from '@angular/router';  // For routing
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';
import { CategoryService } from '../services/category.service';
import { Category } from '../../entities/category.entity';
import { User } from '../../entities/user.entity';
import { Subscription } from 'rxjs';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-header',
  standalone: true,  // This marks the component as standalone
  imports: [CommonModule, FormsModule, RouterModule], // Ensure you include necessary modules here
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  userEmail: string | null = null;
  isSettingsMenuVisible: boolean = false;
  isCategoriesOpen: boolean = false;
  showSearch: boolean = false;
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  canViewAdmin: boolean = false;
  canViewEmployee: boolean = false;
  canViewCustomer: boolean = false;
  logoutMessage: boolean = false; // Nueva propiedad para el mensaje
  user: User = new User(0, '', '', '', '', '', '', '', ''); 

  categories: Category[] = [];

  private authStatusSub: Subscription | undefined;
  private roleSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private router: Router,
    private categoryService: CategoryService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de autenticación y rol reactivos
    this.authStatusSub = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });

    this.roleSub = this.authService.userRole$.subscribe(role => {
      this.canViewAdmin = role === 'admin';
      this.canViewEmployee = role === 'empleado';
      this.canViewCustomer = role === 'cliente';
      this.userEmail = this.authService.getUserEmail();
    });

    // Obtener las categorías del servicio
    this.categoryService.getCategories().subscribe((response) => this.categories = response.data);

    this.ordersService.orderAdded.subscribe(
      () => {this.cartEffect();}
    );
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones al destruir el componente
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
    if (this.roleSub) {
      this.roleSub.unsubscribe();
    }
  }

  toggleSettingsMenu(): void {
    this.isSettingsMenuVisible = !this.isSettingsMenuVisible;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.clearSearch();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search-results'], {
        queryParams: { query: this.searchQuery.trim() },
      });
    }
    if (this.searchQuery === '') {
      this.clearAndCloseSearch();
    }
  }

  clearAndCloseSearch(): void {
    this.clearSearch();
    this.showSearch = false;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout(); // Cierra la sesión
    this.logoutMessage = true; // Muestra el cartel de cierre de sesión
  }

  redirectToHome(): void {
    this.logoutMessage = false; // Oculta el cartel antes de redirigir
    this.router.navigate(['/home']); // Redirige al menú principal
  }


  cartEffect(): void {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
      cartIcon.classList.add('cart-icon-effect');
      setTimeout(() => {
        cartIcon.classList.remove('cart-icon-effect');
      }, 1000);
    }
  }
}
