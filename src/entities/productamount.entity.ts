import { Discount } from "./discount.entity";
import { Product } from "./product.entity";

export class ProductAmount {
    product: Product;
    amount: number;
    discount: Discount;
    constructor(product: Product, amount: number, discount: Discount) {
        this.product = product;
        this.amount = amount;
        this.discount = discount;
    }
}