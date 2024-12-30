import { Component, Input } from '@angular/core';
import { Ticket } from '../../entities/ticket.entity';
import { CommonModule } from '@angular/common';
import { Product } from '../../entities/product.entity';
import { ProductAmount } from '../../entities/productamount.entity';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {

  @Input() ticketInput!: Ticket;
  @Input() cancellable!: boolean;

  @Input() markInProgressButton?: boolean = false;
  @Input() markSentButton?: boolean = false;
  @Input() showUser?: boolean = false;

  showDeleteModal: boolean = false;

  constructor(private ordersService: OrdersService) {}

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteOrder(): void {
    this.ordersService.deleteTicket(this.ticketInput.number).subscribe(() => {
      this.closeDeleteModal();
      window.location.reload();
    });
  }

  getProdutPriceWithDate(prod: Product) {
    const targetDate = new Date(this.ticketInput.date);

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

  getSubTotal(pa: ProductAmount) {
    let price = this.getProdutPriceWithDate(pa.product) ?? 0;
    let subTot = price * pa.amount;
    let subTotDiscount = 0;
    if (pa.discount) {
      subTotDiscount = subTot * (pa.discount.percentage / 100);
    }
    return subTot - subTotDiscount;
  }

  getTotal() {
    let total = 0;
    this.ticketInput.product_amounts.forEach(pa => {
      total += this.getSubTotal(pa);
    });
    return total;
  }

  markInProgress() {
    this.ordersService.markInProgress(this.ticketInput.number).subscribe(() => {
      window.location.reload();
    });
  }
  
  markAsSent() {
    this.ordersService.markAsSent(this.ticketInput.number).subscribe(() => {
      window.location.reload();
    });
  }

  getUser() {
    return this.ticketInput.user;
  }
}
