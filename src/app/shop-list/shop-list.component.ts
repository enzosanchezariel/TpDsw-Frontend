import { Component } from '@angular/core';
import { OrderCardComponent } from "../order-card/order-card.component";
import { Ticket } from '../../entities/ticket.entity';
import { OrdersService } from '../services/orders.service';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { DiscountService } from '../services/discount.service';
import { ProductAmount } from '../../entities/productamount.entity';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [OrderCardComponent, CommonModule],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss'
})
export class ShopListComponent {
  tickets: Ticket[] = []
  cart: ProductAmount[] = []

  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private discountService: DiscountService
  ){}

  ngOnInit(): void {
    this.ordersService.getUserTickets().subscribe((response) => {this.tickets = this.mapTicket(response.data)});
    this.cart = this.ordersService.getCart();
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

    console.log(convertedTickets)

    return convertedTickets;
  }
}
