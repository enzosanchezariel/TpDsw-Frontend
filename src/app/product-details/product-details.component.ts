import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';
import { FormsModule } from '@angular/forms';
import { Price } from '../../entities/price.entity';
import { Category } from '../../entities/category.entity.js';
import { Discount } from '../../entities/discount.entity.js';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service';
import { ProductAmount } from '../../entities/productamount.entity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  amount: number = 0;
  total: number = 0;
  id: string | null = null;
  product: Product = new Product(0, '', '', [new Price(new Date(), 0)], '', 0, '', new Category(0, '', ''), new Discount(0, 0, 0));  
  canViewEmployee: boolean = false;
  canViewAdmin: boolean = false;
  loggedIn: boolean = false;
  cart: ProductAmount[] = [];
  showConfirmation: boolean = false;
  showSuccess: boolean = false;
  canViewCustomer: boolean = false;  
  private authStatusSub: Subscription | undefined;


  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkViews();
    this.route.paramMap.subscribe(params => this.id = params.get('id'));
    if (this.id !== null) {
      this.service.getOneProduct(this.id).subscribe((response) => this.product = response.data);
    }
    this.cart = this.ordersService.getCart();
    const role = this.authService.getRole();
    
    this.authStatusSub = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.canViewCustomer = isAuthenticated && (this.authService.getRole() === 'cliente');
    });

  }

  checkViews(): void {
    this.canViewEmployee = this.authService.getRole() === 'empleado' || this.authService.getRole() === 'admin'; 
    this.canViewAdmin = this.authService.getRole() === 'admin';
    this.loggedIn = this.authService.isAuthenticated();
  }

  confirmDelete(): void {
    this.showConfirmation = true;
  }

  cancelDelete(): void {
    this.showConfirmation = false;
  }

  deleteProduct(): void {
    this.service.deleteProduct(this.product.id.toString()).subscribe(
      () => {
        this.showConfirmation = false;
        this.showSuccess = true;
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
        alert('Ocurrió un error al eliminar el producto.');
      }
    );
  }

  closeSuccess(): void {
    this.showSuccess = false;
    this.router.navigate(['/products']);
  }

  calculateTotal(): number {
    const price = this.product.prices.at(-1)?.price ?? 0;
    const discount = this.product.discount?.percentage ?? 0;

    if (this.product.discount && this.product.discount.units > 0 && this.amount >= this.product.discount.units) {
      const discountPrice = price * (1 - discount / 100);
      const discountedUnits = Math.floor(this.amount / this.product.discount.units) * this.product.discount.units;
      const regularUnits = this.amount % this.product.discount.units;

      return discountedUnits * discountPrice + regularUnits * price;
    }

    return this.amount * price;
  }

  originalTotal(): number {
    const price = this.product.prices.at(-1)?.price ?? 0;
    return price * this.amount;
  }

  addToCart(): void {
    if (this.amount > 0) {
      this.ordersService.addToCart(new ProductAmount(this.product, this.amount, this.product.discount));
    }
  }

  checkIfAdded(): boolean {
    return this.cart.some(pa => pa.product.id === Number(this.id));
  }
}
