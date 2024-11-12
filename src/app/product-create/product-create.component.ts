import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { Price } from '../../entities/price.entity';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: [''],
      desc: [''],
      img: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [null], // Aquí se almacena el ID de la categoría seleccionada
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .subscribe(
        (response: any) => {
          console.log('Respuesta de la API:', response);
          if (Array.isArray(response)) {
            this.categories = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            this.categories = response.data;
          } else {
            console.error('Respuesta de categorías inesperada:', response);
          }
          console.log('Categorías cargadas:', this.categories);
        },
        (error) => {
          console.error('Error al cargar las categorías:', error);
        }
      );
  }

  createProduct(): void {
    const productData = this.productForm.value;

    // Asegúrate de que se ha seleccionado una categoría
    if (!productData.category) {
        console.error('No se ha seleccionado una categoría para el producto');
        return;
    }

    // Busca la categoría seleccionada por su ID en el array de categorías
    const selectedCategory = this.categories.find(category => category.id === Number(productData.category));
    console.log('Categorías cargadas:', this.categories);
    console.log('Categoría seleccionada:', selectedCategory);

    // Verifica si la categoría fue encontrada
    if (!selectedCategory) {
        console.error('Categoría no encontrada para el producto:', productData.category);
        return;
    }

    // Establece el categoryId
    productData.categoryId = selectedCategory.id; // Establecer categoryId

    // Crea el nuevo producto incluyendo la categoría encontrada (solo el ID de la categoría)
    const newProduct = new Product(
        0, // id, se usa 0 para indicar un nuevo producto
        productData.name, // name, del formulario
        productData.desc, // desc, del formulario
        productData.price,
        productData.img, // img, del formulario
        productData.stock, // stock, del formulario
        productData.categoryId, // Solo el ID de la categoría
        0
    );

    console.log('Nuevo producto:', newProduct);
    // Llama al servicio para crear el producto
    this.productsService.createProduct(newProduct).subscribe(
        (response: Product) => {
            console.log('Producto creado:', response);
            this.router.navigate(['/']);
        },
        (error) => {
            console.error('Error al crear el producto:', error);
            if (error.error && error.error.message) {
              // Mostrar mensaje de error específico al usuario
              alert('Error al crear el producto: ' + error.error.message);
            } else {
              // Mostrar mensaje de error genérico al usuario
              alert('Error al crear el producto. Por favor, inténtelo nuevamente.');
            }
                }
    );
  }
}
