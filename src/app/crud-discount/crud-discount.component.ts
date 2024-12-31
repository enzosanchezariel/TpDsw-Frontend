import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../services/discount.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Discount } from '../../entities/discount.entity';

@Component({
  selector: 'app-crud-discount',
  templateUrl: './crud-discount.component.html',
  styleUrls: ['./crud-discount.component.scss']
})
export class CrudDiscountComponent implements OnInit {
  discounts: Discount[] = [];
  discountForm: FormGroup;
  showForm: boolean = false; // Controla si el formulario está visible
  editingDiscount: boolean = false; // Controla si estamos editando un descuento
  discountToEdit: Discount | null = null; // Descuento que se está editando
  discountToDelete: Discount | null = null; // Descuento que se está eliminando
  public errorMessage: string | null = null; // Para los mensajes de error

  // Control de los modales de éxito
  public showCreateSuccess: boolean = false;
  public showUpdateSuccess: boolean = false;
  public showDeleteSuccess: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private discountService: DiscountService
  ) {
    this.discountForm = this.fb.group({
      id: [null],
      percentage: [0, Validators.required],
      units: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    this.discountService.getDiscounts().subscribe(
      (response) => {
        if (Array.isArray(response.data)) {
          this.discounts = response.data;
        }
      },
      (error) => {
        console.error('Error al cargar los descuentos:', error);
      }
    );
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingDiscount = false;
    this.discountForm.reset();
  }

  createDiscount(): void {
    const discountData = this.discountForm.value;
    const missingFields = [];
    if (!discountData.percentage) missingFields.push('Porcentaje');
    if (!discountData.units) missingFields.push('Unidades');

    if (missingFields.length > 0) {
      this.handleError(`Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}.`);
      return;
    }

    const newDiscount = new Discount(discountData.id, discountData.percentage, discountData.units);

    this.discountService.createDiscount(newDiscount).subscribe(
      () => {
        this.showCreateSuccess = true; // Muestra el modal de éxito
        this.showForm = false;
        this.loadDiscounts();
      },
      (error) => {
        console.error('Error al crear el descuento:', error);
        alert('Error al crear el descuento');
      }
    );
  }

  editDiscount(discount: Discount): void {
    this.discountToEdit = discount;
    this.editingDiscount = true;
    this.showForm = true;
    this.discountForm.setValue({
      id: discount.id,
      percentage: discount.percentage,
      units: discount.units
    });
  }

  updateDiscount(): void {
    const discountData = this.discountForm.value;
    const missingFields = [];
    if (!discountData.percentage) missingFields.push('Porcentaje');
    if (!discountData.units) missingFields.push('Unidades');

    if (missingFields.length > 0) {
      this.handleError(`Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}.`);
      return;
    }

    const updatedDiscount = new Discount(discountData.id, discountData.percentage, discountData.units);

    this.discountService.updateDiscount(discountData.id.toString(), updatedDiscount).subscribe(
      () => {
        this.showUpdateSuccess = true; // Muestra el modal de éxito
        this.showForm = false;
        this.loadDiscounts();
      },
      (error) => {
        console.error('Error al actualizar el descuento:', error);
        alert('Error al actualizar el descuento');
      }
    );
  }

  confirmDelete(discount: Discount): void {
    this.discountToDelete = discount; // Asigna el descuento a eliminar
  }

  deleteDiscountConfirmed(): void {
    if (!this.discountToDelete) return;

    this.discountService.deactivateDiscount(this.discountToDelete.id.toString()).subscribe(
      () => {
        this.showDeleteSuccess = true; // Muestra el modal de éxito
        this.discountToDelete = null; // Limpia el descuento seleccionado
        this.loadDiscounts();
      },
      (error) => {
        console.error('Error al eliminar descuento:', error);
        alert('Error al eliminar descuento');
      }
    );
  }

  cancelDelete(): void {
    this.discountToDelete = null; // Cancela la acción de eliminación
  }

  handleError(errorMessage: string): void {
    this.errorMessage = errorMessage;
    console.error(errorMessage);
  }

  // Funciones para cerrar los modales
  closeCreateSuccess() {
    this.showCreateSuccess = false;
  }

  closeUpdateSuccess() {
    this.showUpdateSuccess = false;
  }

  closeDeleteSuccess() {
    this.showDeleteSuccess = false;
  }
}
