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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private discountService: DiscountService
  ) {
    this.productForm = this.fb.group({
      name: [''],
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
        alert('Producto modificado con éxito');
        this.router.navigate(['/product-details', this.originalProduct?.id]);
      },
      (error) => {
        console.error('Error al modificar el producto:', error);
        alert('Error al modificar el producto');
      }
    );
  }
}

  cancel(): void {
    this.router.navigate(['/product-details', this.originalProduct?.id]);
  }
}
