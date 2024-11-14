import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-crud-product',
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.scss']
})
export class CrudProducts implements OnInit {
  products: any[] = [];
  showForm: boolean = false;
  editingProduct: Product | null = null;
  isLoading: boolean = true;
  product: Product | null = null; // Producto actual para confirmación de borrado

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.products = response;
          console.log('Productos cargados:', this.products);
        } else if (response && response.data && Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          console.error('Formato de respuesta inesperado:', response);
        }
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }


  confirmDelete(product: Product): void {
    this.product = product; // Asigna el producto seleccionado para la confirmación
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`);
    if (confirmed) {
      this.deleteProduct();
    }
  }

  deleteProduct(): void {
    if (!this.product) return; // Asegura que hay un producto seleccionado
    this.productsService.deleteProduct(this.product.id.toString()).subscribe(
      () => {
        alert('Producto eliminado con éxito');
        this.loadProducts();
      },
      (error) => console.error('Error al eliminar el producto:', error)
    );
    this.product = null; // Limpia el producto seleccionado después de eliminarlo
  }

  cancel(): void {
    this.showForm = false;
  }
}
