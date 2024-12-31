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
  showDeleteConfirmation: boolean = false; // Controla si se muestra el mensaje de confirmación
  deleteCategoryId: number | null = null; // ID de la categoría a eliminar
  categoryToDeleteName: string | null = null; // Nombre de la categoría a eliminar

  // Variables para mostrar mensajes de éxito
  categoryCreatedSuccess: boolean = false;
  categoryUpdatedSuccess: boolean = false;
  categoryDeletedSuccess: boolean = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Carga las categorías activas desde el servicio
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.data.filter((category: any) => category.status === 'active');
        if (this.categories.length === 0) {
          // Si no hay categorías, crear la primera
          this.createCategory();
        }
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
    if (this.categories.length === 0) {
      this.handleError('No hay categorías disponibles para editar.');
      return;
    }
    this.editingCategoryId = category.id;
    this.newCategoryName = category.name;  // Rellenamos el campo de nombre con los datos de la categoría
    this.addingCategory = false;  // Desactivamos el modo de agregar categoría
  }

  // Actualiza una categoría
  updateCategory(): void {
    // Verifica si hay categorías antes de proceder con la actualización
    if (this.categories.length === 0) {
      this.handleError('No hay categorías disponibles para actualizar.');
      return;
    }

    // Validación para asegurarse de que el nombre no esté vacío
    if (this.newCategoryName.trim() === '') {
      this.handleError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    // Verifica si ya existe una categoría con el mismo nombre y estado activo, pero diferente ID
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        if (response.data.length === 0) {
          this.handleError('No hay categorías para comparar.');
          return;
        }

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
              this.categoryUpdatedSuccess = true; // Mostrar mensaje de éxito
              setTimeout(() => {
                this.categoryUpdatedSuccess = false; // Ocultar mensaje de éxito después de 5 segundos
              }, 5000);
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

  // Crear una nueva categoría
  createCategory(): void {
    if (this.categories.length === 0) {
      // Si ya hay categorías, no creamos la primera
      const newCategory = new Category(0, this.newCategoryName, 'active');
      this.categoryService.createCategory(newCategory).subscribe(
        () => {
          this.categoryCreatedSuccess = true; // Mostrar mensaje de éxito
          setTimeout(() => {
            this.categoryCreatedSuccess = false; // Ocultar mensaje de éxito después de 5 segundos
          }, 5000);
          this.loadCategories(); // Recargar las categorías después de crear la primera
          this.newCategoryName = '';
          this.addingCategory = false;
        },
        (error) => {
          this.handleError('Error al crear la categoría. Inténtelo nuevamente.');
        }
      );
    } else {
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
              this.categoryCreatedSuccess = true; // Mostrar mensaje de éxito
              setTimeout(() => {
                this.categoryCreatedSuccess = false; // Ocultar mensaje de éxito después de 5 segundos
              }, 5000);
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
  }

  // Función para confirmar la eliminación de una categoría
  confirmDeleteCategory(categoryId: number, categoryName: string): void {
    if (this.categories.length === 0) {
      this.handleError('No hay categorías para eliminar.');
      return;
    }
    this.deleteCategoryId = categoryId;
    this.categoryToDeleteName = categoryName; // Guardamos el nombre de la categoría para mostrar en el modal
    this.showDeleteConfirmation = true;
  }

  // Función para eliminar una categoría
  deleteCategory(categoryId: number): void {
    if (this.categories.length === 0) {
      this.handleError('No hay categorías para eliminar.');
      return;
    }
    this.categoryService.deleteCategory(categoryId.toString()).subscribe(
      () => {
        this.categoryDeletedSuccess = true; // Mostrar mensaje de éxito
        setTimeout(() => {
          this.categoryDeletedSuccess = false; // Ocultar mensaje de éxito después de 5 segundos
        }, 5000);
        this.showDeleteConfirmation = false; // Ocultar la confirmación de eliminación
        this.loadCategories(); // Recargar las categorías después de la eliminación
      },
      (error) => {
        this.handleError('Error al eliminar la categoría. Inténtelo nuevamente.');
      }
    );
  }

  // Función para cancelar la eliminación
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.deleteCategoryId = null;
    this.categoryToDeleteName = null; // Limpiar el nombre de la categoría en caso de cancelar
  }

  closeCreateSuccess() {
    this.categoryCreatedSuccess = false;
  }

  closeUpdateSuccess() {
    this.categoryUpdatedSuccess = false;
  }

  closeDeleteSuccess() {
    this.categoryDeletedSuccess = false;
  }

  // Cancelar la edición
  cancelEdit(): void {
    this.editingCategoryId = null;
    this.newCategoryName = '';
  }

  // Manejo centralizado de errores
  handleError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null; // Limpiar el mensaje después de 5 segundos
    }, 5000);
  }
}
