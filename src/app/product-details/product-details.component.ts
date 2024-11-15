import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';
import { FormsModule } from '@angular/forms';
import { Price } from '../../entities/price.entity';
import { Category } from '../../entities/category.entity.js';
import { Discount } from '../../entities/discount.entity.js';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { OrdersService } from '../services/orders.service';
import { ProductAmount } from '../../entities/productamount.entity';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  amount: number = 0;
  total: number = 0;
  id: string | null = null;
  product: Product = new Product(0, '', '', [new Price(new Date(), 0)], '', 0,'', new Category(0, '',''), new Discount(0, 0, 0));  
  canViewEmployee: boolean = false;
  canViewAdmin: boolean = false;
  loggedIn: boolean = false;

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
  }

  checkViews(): void {
    this.canViewEmployee = this.authService.getRole() === 'empleado' || this.authService.getRole() === 'admin'; 
    this.canViewAdmin = this.authService.getRole() === 'admin';
    this.loggedIn = this.authService.isAuthenticated();
  }

  confirmDelete(): void {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${this.product.name}"?`);
    if (confirmed) {
      this.deleteProduct();
    }
  }

  deleteProduct(): void {
    this.service.deleteProduct(this.product.id.toString()).subscribe(
      () => {
        alert('Producto eliminado exitosamente.');
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
        alert('Ocurrió un error al eliminar el producto.');
      }
    );
  }

  // Calcula el total, considerando el descuento solo si se cumplen las condiciones
  calculateTotal(): number {
    const price = this.product.prices.at(-1)?.price ?? 0;
    const discount = this.product.discount?.percentage ?? 0;
    
    // Si el producto tiene descuento y se cumple el requisito de unidades
    if (this.product.discount && this.product.discount.units > 0 && this.amount >= this.product.discount.units) {
      const discountPrice = price * (1 - discount / 100);
      const discountedUnits = Math.floor(this.amount / this.product.discount.units) * this.product.discount.units;
      const regularUnits = this.amount % this.product.discount.units;

      // Total con el descuento aplicado a las unidades que cumplen el requisito
      return discountedUnits * discountPrice + regularUnits * price;
    }

    // Si no hay descuento, devolver el total sin descuento
    return this.amount * price;
  }

  // Calcula el total original sin aplicar descuentos
  originalTotal(): number {
    const price = this.product.prices.at(0)?.price ?? 0;
    return price * this.amount;
  }

  addToCart(): void {
    if (this.amount > 0) {
      this.ordersService.addToCart(new ProductAmount(this.product, this.amount, this.product.discount));
    }
  }
}
