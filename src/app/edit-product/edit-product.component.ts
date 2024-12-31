import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { DiscountService } from '../services/discount.service';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  originalProduct: Product | null = null;
  discounts: any[] = [];
  isLoading: boolean = true; // Control de carga
  errorMessage: string | null = null; // Mensaje de error
  public successModalVisible: boolean = false; // Control del modal de éxito


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private discountService: DiscountService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      desc: [''],
      img: [''],
      stock: [0, Validators.required],
      status: ['active'],
      prices: [0, Validators.required],
      category: [null, Validators.required],
      discount_id: [null]
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getOneProduct(productId).subscribe(
        (response) => {
          this.originalProduct = response.data;

          if (this.originalProduct) {
            const lastPrice = this.originalProduct?.prices?.[this.originalProduct.prices.length - 1]?.price || 0;

            // Inicializar el formulario con los valores del producto original
            this.productForm.patchValue({
              name: this.originalProduct.name,
              desc: this.originalProduct.desc,
              img: this.originalProduct.img,
              stock: this.originalProduct.stock,
              status: this.originalProduct.status,
              prices: lastPrice,
              category: this.originalProduct.category?.id,
              discount_id: this.originalProduct.discount?.id || null
            });
          } else {
            alert('El producto no existe o no está disponible.');
            this.router.navigate(['/products']); // Redirigir a una lista de productos
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al cargar el producto:', error);
          alert('Error al cargar el producto.');
          this.isLoading = false;
          this.router.navigate(['/products']); // Redirigir en caso de error
        }
      );
    } else {
      alert('ID de producto no especificado.');
      this.router.navigate(['/products']);
    }
  }

  loadDiscounts(): void {
    this.discountService.getDiscounts().subscribe(
      (response) => {
        console.log('Descuentos cargados:', response);
        this.discounts = Array.isArray(response.data) ? response.data : [];
      },
      (error) => {
        console.error('Error al cargar los descuentos:', error);
      }
    );
  }

  updateProduct(): void {
    // Validación para asegurarse de que el nombre no esté vacío
    if (this.productForm.value.name.trim() === '') {
      this.handleError('El nombre del producto no puede estar vacío.');
      return;
    }

    const productData = this.productForm.value;

    const missingFields = [];
    if (!productData.desc) missingFields.push('Descripción');
    if (!productData.img || productData.price <= 0) missingFields.push('Imagen');
    if (!productData.prices || productData.prices <= 0) missingFields.push('Precio');
    if (!productData.category) missingFields.push('Categoría');

    if (missingFields.length > 0) {
      this.handleError(`Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}.`);
      return;
    }

    // Verificar si ya existe un producto con el mismo nombre (exceptuando el producto actual)
    this.productsService.getAllProducts().subscribe(
      (response) => {
        const existingProduct = response.data.find(
          (product: any) =>
            product.name.toLowerCase() === this.productForm.value.name.toLowerCase() &&
            product.status === 'active' &&
            product.id !== this.originalProduct?.id // Asegurarse de que no se compare con el producto actual
        );

        if (existingProduct) {
          this.handleError(`Ya existe un producto activo con el nombre "${this.productForm.value.name}".`);
          return;
        }

        if(this.productForm.get('discount_id')?.value === "null"){
          this.productForm.patchValue({ discount_id: null });
        }

        // Si no existe un producto con el mismo nombre, proceder con la actualización
        if (this.originalProduct) {
          const updatedProduct = {
            id: this.originalProduct.id,
            name: this.productForm.value.name,
            desc: this.productForm.value.desc,
            img: this.productForm.value.img,
            stock: this.productForm.value.stock,
            status: this.productForm.value.status,
            prices: this.productForm.value.prices,
            category: this.productForm.value.category,
            discount: this.productForm.value.discount_id || null // Asigna null si no hay descuento
          };

          this.productsService.updateProduct(this.originalProduct.id.toString(), updatedProduct).subscribe(
            (response) => {
              console.log('Producto actualizado:', response);
              this.successModalVisible = true; // Mostrar el modal de éxito

            },
            (error) => {
              console.error('Error al modificar el producto:', error);
              this.handleError('Error al modificar el producto.');
            }
          );
        }
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
        this.handleError('Error al cargar los productos.');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/product-details', this.originalProduct?.id]);
  }

  closeSuccessModal(): void {
    this.successModalVisible = false;
    this.router.navigate(['/']); // Redirigir después de cerrar el modal
  }

  // Manejo centralizado de errores
  handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null; // Limpiar el mensaje después de 5 segundos
    }, 5000);
  }
}
