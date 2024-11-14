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
  newCategory: Category = new Category(0, '');
  searchTerm: string = '';  // Variable para búsqueda por nombre
  sortField: string = '';  // Campo por el que se ordenará (id o name)
  sortDirection: boolean = true; // Dirección de orden: true es ascendente, false es descendente

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.sortCategories();  // Ordenar después de cargar los datos
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  // Función de ordenamiento
  sort(field: string): void {
    this.sortField = field;
    this.sortDirection = !this.sortDirection;  // Cambiar la dirección de orden cada vez que se haga clic
    this.sortCategories();  // Ordenar después de hacer clic
  }

  sortCategories(): void {
    if (this.sortField) {
      this.categories.sort((a, b) => {
        if (a[this.sortField] < b[this.sortField]) return this.sortDirection ? -1 : 1;
        if (a[this.sortField] > b[this.sortField]) return this.sortDirection ? 1 : -1;
        return 0;
      });
    }
  }

  // Getter para filtrar categorías según el término de búsqueda
  get filteredCategories() {
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  startEditCategory(category: any): void {
    this.editingCategoryId = category.id;
  }

  updateCategory(category: any): void {
    if (category.name.trim() === '') {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }
    
    const idCategory = category.id.toString();
    const updatedCategory = { id: idCategory, name: category.name }; // Crear un objeto de tipo Category

    this.categoryService.updateCategory(category.id, updatedCategory).subscribe(
      () => {
        this.editingCategoryId = null;
        this.loadCategories();
      },
      (error) => {
        console.error('Error al actualizar la categoría:', error);
      }
    );
  }

  cancelEdit(): void {
    this.editingCategoryId = null;
    this.loadCategories(); // Recargar las categorías para restaurar el nombre original si se cancela la edición
  }

  createCategory(): void {
    if (this.newCategoryName.trim() === '') {
      alert('El nombre de la categoría no puede estar vacío.');
      return;
    }

    const newCategory = new Category(0, this.newCategoryName); // Crear un objeto de tipo Category
    this.categoryService.createCategory(newCategory).subscribe(
      (response) => {
        this.loadCategories();
        this.newCategoryName = '';
        this.addingCategory = false;
      },
      (error) => {
        console.error('Error al crear la categoría:', error);
      }
    );
  }

  cancelAdd(): void {
    this.addingCategory = false;
    this.newCategoryName = '';
  }

  confirmDeleteCategory(categoryId: number): void {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta categoría?');
    if (confirmation) {
      this.deleteCategory(categoryId);
    }
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId.toString()).subscribe(
      (response) => {
        console.log(response); // Esto debería mostrar "Category removed"
        this.loadCategories(); // Recargar las categorías después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la categoría:', error);
      }
    );
  }
}
