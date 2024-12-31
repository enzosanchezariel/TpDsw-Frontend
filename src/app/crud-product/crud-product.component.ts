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
  increaseAmount: number = 0; // Cantidad a aumentar
  productToIncrease: Product | null = null; // Producto seleccionado para aumentar el stock
  showIncreaseStockModal: boolean = false; // Controla la visibilidad del modal
  showDeleteSuccess: boolean = false; // Controla la visibilidad del mensaje de éxito
  public productDeletedSuccess: boolean = false;
  
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

  // Aumentar stock
  openIncreaseStockModal(product: Product): void {
    this.productToIncrease = product;
    this.showIncreaseStockModal = true;
  }

  closeIncreaseStockModal(): void {
    this.showIncreaseStockModal = false;
  }

  increaseStock(): void {
  console.log("Valor de increaseAmount antes de validarlo:", this.increaseAmount);

  if (isNaN(this.increaseAmount) || this.increaseAmount <= 0 || !this.productToIncrease) {
    this.message = 'Por favor ingrese una cantidad válida para aumentar el stock.';
    return;
  }

  this.productsService.increaseStock(this.productToIncrease.id.toString(), this.increaseAmount).subscribe(
    (response) => {
      this.message = `Stock aumentado exitosamente para el producto "${this.productToIncrease?.name}".`;
      this.loadProducts(); 
      this.closeIncreaseStockModal(); 
      this.increaseAmount = 0;
    },
    (error) => {
      console.error('Error al aumentar el stock:', error);
      this.message = `Hubo un error al aumentar el stock: ${error.message}`;
    }
  );
}



  // Confirmación de eliminación
  confirmDelete(product: Product): void {
    this.product = product; // Asigna el producto seleccionado para la confirmación
  }

  deleteProduct(): void {
    if (!this.product) return; // Asegura que hay un producto seleccionado
    this.productsService.deactivateProduct(this.product.id.toString(), this.product).subscribe(
      () => {
        this.productDeletedSuccess = true; // Muestra el mensaje de éxito
        this.loadProducts();
      },
      (error) => console.error('Error al eliminar el producto:', error)
    );
    this.product = null; // Limpia el producto seleccionado después de eliminarlo
  }

  closeDeleteSuccess() {
    this.productDeletedSuccess = false;
  }

  cancel(): void {
    this.product = null; // Cancela la acción de eliminación
  }

  // Mostrar mensaje dinámico
  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 3000); // El mensaje desaparece después de 3 segundos
  }
}
