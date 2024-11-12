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
  product: Product = new Product(0, '', '', [new Price(new Date(), 0)], '', 0, new Category(0, ''), 0);  
  canViewEmployee: boolean = false;
  canViewAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private authService: AuthService,
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

}
