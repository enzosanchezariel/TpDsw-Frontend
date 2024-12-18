import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../entities/ticket.entity';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service'; // Asegúrate de importar tu servicio
import { Product } from '../../entities/product.entity.js';
import { ProductAmount } from '../../entities/productamount.entity.js';
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

  tickets: Ticket[] = []

  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private discountService: DiscountService
  ){}

  ngOnInit(): void {
    this.ordersService.getAllTickets().subscribe((response) => {this.tickets = this.mapTicket(response.data)});
  }

  mapTicket(data: any): Ticket[] {
    let convertedTickets: Ticket[] = [];
    for (let aTicket of data) {
      for (let aPA of aTicket.product_amounts) {
        this.productsService.getOneProduct(aPA.product).subscribe(
          (response) => {
            aPA.product = response.data
          }
        );
        if (aPA.discount) {
          this.discountService.getDiscountById(aPA.discount).subscribe(
            (response) => {
              aPA.discount = response.data
            }
          );
        }
      }
      convertedTickets.push(aTicket)
    }

    return convertedTickets;
  }
}
