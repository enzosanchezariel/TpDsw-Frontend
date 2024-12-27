import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-crud-product',
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.scss']
})
export class CrudProducts implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  showForm: boolean = false;
  editingProduct: Product | null = null;
  isLoading: boolean = true;
  product: Product | null = null; // Producto actual para confirmación de borrado
  searchTerm: string = ''; // Término de búsqueda
  message: string | null = null; // Mensaje dinámico

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.products = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          console.error('Formato de respuesta inesperado:', response);
          return;
        }
        this.filteredProducts = this.products; // Inicializa la lista filtrada
        console.log('Productos cargados:', this.products);
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }

  confirmDelete(product: Product): void {
    this.product = product; // Asigna el producto seleccionado para la confirmación
  }

  deleteProduct(): void {
    if (!this.product) return; // Asegura que hay un producto seleccionado
    this.productsService.deactivateProduct(this.product.id.toString(), this.product).subscribe(
      () => {
        this.showMessage(`El producto "${this.product?.name}" fue eliminado con éxito.`);
        this.loadProducts();
      },
      (error) => console.error('Error al eliminar el producto:', error)
    );
    this.product = null; // Limpia el producto seleccionado después de eliminarlo
  }

  cancel(): void {
    this.product = null; // Cancela la acción de eliminación
  }

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 3000); // El mensaje desaparece después de 3 segundos
  }
}
