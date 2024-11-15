import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../entities/ticket.entity';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service'; // Asegúrate de importar tu servicio
import { Product } from '../../entities/product.entity.js';
import { ProductAmount } from '../../entities/productamount.entity.js';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class AdminOrderListComponent implements OnInit {

  tickets: Ticket[] = [];  // Array para almacenar los tickets

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    // Cargar todos los tickets al iniciar el componente
    this.loadOrders();
  }

  // Método para cargar los tickets desde el backend
  loadOrders() {
    this.ordersService.getAllTickets().subscribe(
      (tickets: Ticket[]) => {
        this.tickets = tickets;  // Asignar los tickets a la variable 'tickets'
      },
      (error) => {
        console.error('Error loading tickets:', error);
      }
    );
  }

  // Método para obtener el precio de un producto con fecha específica
  getProdutPriceWithDate(prod: Product, ticketDate: Date) {
    const targetDate = new Date(ticketDate);

    const validPrices = prod.prices.filter(price => {
      const priceDate = new Date(price.date);
      return priceDate <= targetDate;
    });

    if (validPrices.length === 0) {
      return 0;
    }

    validPrices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return validPrices[0].price ?? 0;
  }

  // Método para calcular el subtotal con los descuentos
  getSubTotal(pa: ProductAmount, ticketDate: Date) {
    let price = this.getProdutPriceWithDate(pa.product, ticketDate) ?? 0;
    let subTot = price * pa.amount;
    let subTotDiscount = 0;
    if (pa.discount) {
      subTotDiscount = subTot * (pa.discount.percentage / 100);
    }
    return subTot - subTotDiscount;
  }

  // Método para obtener el total del ticket
  getTotal(ticket: Ticket) {
    let total = 0;
    ticket.product_amounts.forEach(pa => {
      total += this.getSubTotal(pa, ticket.date);
    });
    return total;
  }
}
