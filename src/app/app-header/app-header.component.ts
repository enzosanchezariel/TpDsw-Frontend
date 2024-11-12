import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // For ngModel binding
import { CommonModule } from '@angular/common';  // For ngIf, ngFor, etc.
import { RouterModule } from '@angular/router';  // For routing
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';
import { CategoryService } from '../services/category.service';
import { Category } from '../../entities/category.entity';
import { User } from '../../entities/user.entity.js';

@Component({
  selector: 'app-header',
  standalone: true,  // This marks the component as standalone
  imports: [CommonModule, FormsModule, RouterModule], // Ensure you include necessary modules here
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  userEmail: string = '';
  isSettingsMenuVisible: boolean = false;
  isCategoriesOpen: boolean = false;
  showSearch: boolean = false;
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  canViewAdmin: boolean = false;
  user: User = new User(0, '', '', '', '', '', '', '', ''); 

  categories: Category[] = [];

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.canViewAdmin = this.authService.getRole() === 'admin';
    this.categoryService.getCategories().subscribe((response) => this.categories = response.data)
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
    this.authService.logout();
    this.isLoggedIn = this.authService.isAuthenticated();
    alert('Sesión cerrada');
  }
}
