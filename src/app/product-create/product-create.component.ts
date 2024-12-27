import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  products: any[] = [];
  public errorMessage: string | null = null; // Para los mensajes de error
  public successModalVisible: boolean = false; // Control del modal de éxito

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      desc: [''],
      img: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required], // ID de la categoría, obligatorio
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            this.categories = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            this.categories = response.data;
          } else {
            this.handleError('Error al cargar las categorías. Respuesta inesperada.');
          }
        },
        (error) => {
          this.handleError('Error al cargar las categorías. Por favor, inténtelo nuevamente.');
        }
      );
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.products = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          this.handleError('Error al cargar los productos. Respuesta inesperada.');
        }
      },
      (error) => {
        this.handleError('Error al cargar los productos. Por favor, inténtelo nuevamente.');
      }
    );
  }

  createProduct(): void {
    const productData = this.productForm.value;

    const missingFields = [];
    if (!productData.name) missingFields.push('Nombre');
    if (!productData.category) missingFields.push('Categoría');
    if (!productData.price || productData.price <= 0) missingFields.push('Precio');
    if (!productData.stock || productData.stock < 0) missingFields.push('Stock');

    if (missingFields.length > 0) {
      this.handleError(`Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}.`);
      return;
    }

    const existingProduct = this.products.find(
      (product) => product.name.toLowerCase() === productData.name.toLowerCase()
    );

    if (existingProduct) {
      this.handleError(`Ya existe un producto con el nombre '${productData.name}'. Por favor, elija otro nombre.`);
      return;
    }

    const selectedCategory = this.categories.find(category => category.id === Number(productData.category));

    if (!selectedCategory) {
      this.handleError(`La categoría seleccionada (${productData.category}) no es válida.`);
      return;
    }

    productData.categoryId = selectedCategory.id;

    const newProduct = new Product(
      0,
      productData.name,
      productData.desc,
      productData.price,
      productData.img,
      productData.stock,
      productData.status,
      productData.categoryId,
      productData.discount
    );

    this.productsService.createProduct(newProduct).subscribe(
      (response: Product) => {
        console.log('Producto creado:', response);
        this.successModalVisible = true; // Mostrar el modal de éxito
      },
      (error) => {
        if (error.error && error.error.message) {
          this.handleError('Error al crear el producto: ' + error.error.message);
        } else {
          this.handleError('Error al crear el producto. Por favor, inténtelo nuevamente.');
        }
      }
    );
  }

  closeSuccessModal(): void {
    this.successModalVisible = false;
    this.router.navigate(['/']); // Redirigir después de cerrar el modal
  }

  handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}
