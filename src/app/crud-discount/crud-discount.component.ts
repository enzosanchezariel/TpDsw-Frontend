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
  discounts: any[] = [];
  discountForm: FormGroup;
  showForm: boolean = false; // Controla si el formulario está visible
  editingDiscount: boolean = false; // Controla si estamos editando un descuento
  discountToEdit: any = null; // Descuento que se está editando

  constructor(
    private fb: FormBuilder, 
    private discountService: DiscountService) {
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

  createDiscount(): void {
    const discountData = this.discountForm.value;
    const newDiscount = new Discount(discountData.id,discountData.percentage, discountData.units);

    this.discountService.createDiscount(newDiscount).subscribe(
      (response) => {
        alert('Descuento creado con éxito');
        this.showForm = false; // Ocultar el formulario después de crear
        this.loadDiscounts(); // Recargar los descuentos
      },
      (error) => {
        console.error('Error al crear el descuento:', error);
        alert('Error al crear el descuento');
      }
    );
  }

  showCreateForm(): void {
    this.showForm = true; // Muestra el formulario al hacer clic en "Crear descuento"
    this.editingDiscount = false; // Asegúrate de que no se está editando un descuento
    this.discountForm.reset(); // Resetea el formulario
  }

  editDiscount(discount: any): void {
    this.discountToEdit = discount;
    this.editingDiscount = true; // Estamos editando
    this.showForm = true; // Mostrar el formulario
    this.discountForm.setValue({
      id: discount.id,
      percentage: discount.percentage,
      units: discount.units
    }); // Rellenar el formulario con los datos del descuento
  }

  updateDiscount(): void {
    const discountData = this.discountForm.value;
    const updatedDiscount = new Discount(discountData.id,discountData.percentage, discountData.units);
    updatedDiscount.id = discountData.id;

    this.discountService.updateDiscount(discountData.id.toString(),updatedDiscount).subscribe(
      (response) => {
        alert('Descuento actualizado con éxito');
        this.showForm = false; // Ocultar el formulario después de actualizar
        this.loadDiscounts(); // Recargar los descuentos
      },
      (error) => {
        console.error('Error al actualizar el descuento:', error);
        alert('Error al actualizar el descuento');
      }
    );
  }

  deleteDiscount(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este descuento?')) {
      this.discountService.deactivateDiscount(id.toString()).subscribe(
        (response) => {
          alert('Descuento eliminado');
          this.loadDiscounts(); // Recargar la lista de descuentos
        },
        (error) => {
          console.error('Error al eliminar descuento:', error);
          alert('Error al eliminar descuento');
        }
      );
    }
  }
}
