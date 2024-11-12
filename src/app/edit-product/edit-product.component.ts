import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  originalProduct: Product | null = null;  // Guardar el producto original

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      name: [''],
      desc: [''],
      img: [''],
      stock: [0, Validators.required],
      prices: [0, Validators.required],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getOneProduct(productId).subscribe((response) => {
        this.originalProduct = response.data;

        const lastPrice = this.originalProduct?.prices?.[this.originalProduct.prices.length - 1]?.price;

        // Inicializar el formulario con los valores del producto original
        this.productForm.patchValue({
          name: this.originalProduct?.name,
          desc: this.originalProduct?.desc,
          img: this.originalProduct?.img,
          stock: this.originalProduct?.stock,
          prices: lastPrice,
          category: this.originalProduct?.category?.id
        });
      });
    }
  }

  updateProduct(): void {
    if (this.originalProduct) {
      // Crear el objeto actualizado mezclando los valores del formulario con los originales
      const updatedProduct = {
        ...this.originalProduct, // Copiar el producto original
        ...this.productForm.value // Sobrescribir con los valores del formulario
      };

      this.productsService.updateProduct(this.originalProduct.id.toString(), updatedProduct).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          alert('Producto modificado con éxito');
          this.router.navigate(['/product-details', this.originalProduct!.id]);
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
