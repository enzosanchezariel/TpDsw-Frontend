import { Delivery } from "./delivery.entity";
import { Product } from "./product.entity";
import { ProductAmount } from "./productamount.entity";
import { User } from "./user.entity";

export class Ticket {
    number: number;
    date: Date;
    state: string;
    user: User;
    product_amounts: ProductAmount[];
    delivery?: Delivery;
    constructor(number: number, date: Date, state: string, user: User, product_amounts: ProductAmount[], delivery?: Delivery) {
        this.number = number;
        this.date = date;
        this.state = state;
        this.user = user;
        this.product_amounts = product_amounts;
        this.delivery = delivery;
    }
}