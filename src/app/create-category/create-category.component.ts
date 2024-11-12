import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../entities/category.entity';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']  

})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private categoryService: CategoryService,
    private router: Router) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required]
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

  createCategory(): void {
    const categoryData = this.categoryForm.value;
    const newCategory = new Category(0, categoryData.name);
    
    // Verifica si el nombre de la categoría ya existe
    const categoryExists = this.categories.some(category => category.name.trim().toLowerCase() === newCategory.name.toLowerCase());
  
  if (categoryExists) {
    alert('El nombre de la categoría ya existe. Elige otro nombre.');
    return;
  }

    console.log(newCategory);
    
    this.categoryService.createCategory(newCategory).subscribe(
      (response: Category) => {
        console.log('Categoría creada:', response);
        alert('Categoría creada con éxito'); // Alerta de éxito
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error al crear la categoría:', error);
        alert('Error al crear la categoría'); // Alerta de error
      }
    );
  }
}

