import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../../entities/category.entity.js';

@Component({
  selector: 'app-crud-category',
  templateUrl: './crud-category.component.html',
  styleUrls: ['./crud-category.component.scss']
})
export class CrudCategory implements OnInit {
  categories: any[] = [];
  editingCategoryId: number | null = null;
  addingCategory: boolean = false;
  newCategoryName: string = '';
  searchTerm: string = ''; // Variable para búsqueda por nombre
  errorMessage: string | null = null; // Mensaje de error para el manejo centralizado

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Carga las categorías activas desde el servicio
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.data.filter((category: any) => category.status === 'active');
      },
      (error) => {
        this.handleError('Error al cargar las categorías. Inténtelo nuevamente.');
      }
    );
  }

  // Filtra categorías según el término de búsqueda
  get filteredCategories() {
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Inicia la edición de una categoría
  startEditCategory(category: any): void {
    this.editingCategoryId = category.id;
    this.newCategoryName = category.name;  // Rellenamos el campo de nombre con los datos de la categoría
    this.addingCategory = false;  // Desactivamos el modo de agregar categoría
  }

  // Actualiza una categoría
updateCategory(): void {
  // Validación para asegurarse de que el nombre no esté vacío
  if (this.newCategoryName.trim() === '') {
    this.handleError('El nombre de la categoría no puede estar vacío.');
    return;
  }

  // Verifica si ya existe una categoría con el mismo nombre y estado activo, pero diferente ID
  this.categoryService.getCategories().subscribe(
    (response: any) => {
      const existingCategory = response.data.find(
        (category: any) =>
          category.name.toLowerCase() === this.newCategoryName.toLowerCase() &&
          category.status === 'active' &&
          category.id !== this.editingCategoryId // Asegurarse de que no se compare con la categoría actual
      );

      if (existingCategory) {
        this.handleError(`Ya existe una categoría activa con el nombre "${this.newCategoryName}".`);
        return;
      }

      // Busca la categoría a actualizar
      const categoryToUpdate = this.categories.find(
        category => category.id === this.editingCategoryId
      );

      // Si se encuentra la categoría, se actualiza
      if (categoryToUpdate) {
        const updatedCategory = { ...categoryToUpdate, name: this.newCategoryName };

        this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe(
          () => {
            this.editingCategoryId = null; // Resetear la categoría en edición
            this.newCategoryName = ''; // Limpiar el nombre
            this.loadCategories(); // Recargar las categorías
          },
          (error) => {
            this.handleError('Error al actualizar la categoría. Inténtelo nuevamente.');
          }
        );
      }
    },
    (error) => {
      this.handleError('Error al cargar las categorías. Inténtelo nuevamente.');
    }
  );
}

  // Cancelar la edición
  cancelEdit(): void {
    this.editingCategoryId = null;
    this.newCategoryName = '';
  }

  // Crear una nueva categoría
  createCategory(): void {
    // Validación para asegurarse de que el nombre no esté vacío
    if (this.newCategoryName.trim() === '') {
      this.handleError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    this.categoryService.getCategories().subscribe(
      (response: any) => {
        const existingCategory = response.data.find(
          (category: any) =>
            category.name.toLowerCase() === this.newCategoryName.toLowerCase() &&
            category.status === 'active'
        );

        if (existingCategory) {
          this.handleError(`Ya existe una categoría activa con el nombre "${this.newCategoryName}".`);
          return;
        }

        const newCategory = new Category(0, this.newCategoryName, 'active');
        this.categoryService.createCategory(newCategory).subscribe(
          () => {
            this.loadCategories();
            this.newCategoryName = '';
            this.addingCategory = false;
          },
          (error) => {
            this.handleError('Error al crear la categoría. Inténtelo nuevamente.');
          }
        );
      },
      (error) => {
        this.handleError('Error al cargar las categorías. Inténtelo nuevamente.');
      }
    );
  }

  // Método para confirmar la eliminación de una categoría
  confirmDeleteCategory(categoryId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.deleteCategory(categoryId);  // Llama a la función que elimina la categoría
    }
  }

  // Función para eliminar una categoría
  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId.toString()).subscribe(
      () => {
        this.loadCategories(); // Recarga las categorías después de la eliminación
      },
      (error) => {
        this.handleError('Error al eliminar la categoría. Inténtelo nuevamente.');
      }
    );
  }

  // Manejo centralizado de errores
  handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null; // Limpiar el mensaje después de 5 segundos
    }, 5000);
  }
}
