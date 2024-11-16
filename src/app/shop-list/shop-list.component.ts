import { Component } from '@angular/core';
import { OrderCardComponent } from "../order-card/order-card.component";
import { Ticket } from '../../entities/ticket.entity';
import { OrdersService } from '../services/orders.service';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { DiscountService } from '../services/discount.service';
import { ProductAmount } from '../../entities/productamount.entity';
import { AuthService } from '../services/auth.service';

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
  
  getSubTotalCart(pa: ProductAmount) {
    let price = pa.product.prices[pa.product.prices.length -1].price;
    let subTot = price * pa.amount;
    let subTotDiscount = 0;
    if (pa.discount && pa.amount >= pa.discount.units) {
      subTotDiscount = subTot * (pa.discount.percentage / 100);
    }
    return subTot - subTotDiscount;
  }

  getTotalCart() {
    let total = 0;
    this.cart.forEach(pa => {
      total += this.getSubTotalCart(pa);
    });
    return total;
  }

  removeFromCart(idProd: number) {
    const index = this.cart.findIndex(pa => pa.product.id === idProd);
    if (index !== -1) {
      this.ordersService.removeFromCart(index);
    }
  }

  sendOrder() {
    this.ordersService.sendCart().subscribe((Response) => {});
    this.ordersService.resetCart();
    this.cart = [];
    location.reload();
  }
}
