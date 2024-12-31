import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../entities/ticket.entity';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service'; 
import { ProductsService } from '../services/products.service';
import { DiscountService } from '../services/discount.service';
import { OrderCardComponent } from "../order-card/order-card.component";

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class AdminOrderListComponent implements OnInit {

  tickets: Ticket[] = [];
  showModal: boolean = false; // Estado del modal
  selectedTicket: Ticket | null = null; // Ticket seleccionado para cancelación

  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.ordersService.getAllTickets().subscribe((response) => {
      this.tickets = this.mapTicket(response.data);
    });
  }

  mapTicket(data: any): Ticket[] {
    let convertedTickets: Ticket[] = [];
    for (let aTicket of data) {
      for (let aPA of aTicket.product_amounts) {
        this.productsService.getOneProduct(aPA.product).subscribe(
          (response) => {
            aPA.product = response.data;
          }
        );
        if (aPA.discount) {
          this.discountService.getDiscountById(aPA.discount).subscribe(
            (response) => {
              aPA.discount = response.data;
            }
          );
        }
      }
      convertedTickets.push(aTicket);
    }
    return convertedTickets;
  }

  // Abre el modal para confirmar la cancelación del pedido
  openConfirmationModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.showModal = true;
  }

  // Cierra el modal
  closeModal(): void {
    this.showModal = false;
    this.selectedTicket = null;
  }

  // Confirma la cancelación y llama al servicio para cancelar el pedido
  confirmCancellation(): void {
    if (this.selectedTicket) {
      this.ordersService.deleteTicket(this.selectedTicket.number).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta de la cancelación
          this.showModal = false; // Cerrar el modal
          this.selectedTicket = null; // Limpiar el ticket seleccionado
          alert('Pedido cancelado con éxito');
          this.ngOnInit(); // Recargar los tickets
        },
        (error) => {
          console.error('Error al cancelar el pedido:', error);
          alert('Error al cancelar el pedido');
        }
      );
    }
  }
}
