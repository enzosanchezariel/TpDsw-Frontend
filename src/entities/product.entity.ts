import { Category } from "./category.entity";
import { Discount } from "./discount.entity";
import { Price } from "./price.entity";

export class Product {
    public id: Number;
    public name: string;
    public desc: string;
    public img: string;
    public stock: number;

    public prices: Price[];
    public category: Category;
    public discount: Discount;

    constructor(id: Number, name: string, desc: string, prices: Price[], img: string, stock: number, category: any, discount: any) {
        this.stock = stock;
        this.prices = prices;
        this.desc = desc;
        this.name = name;
        this.img = img;
        this.id = id;
        this.category = category;
        this.discount = discount;
    }
}