import { Category } from "./category.entity";
import { Discount } from "./discount.entity";
import { Price } from "./price.entity";

export class Product {
    public id: number; 
    public name: string;
    public desc: string;
    public img: string;
    public stock: number;
    public status: string;
    public prices: Price[] = [];
    public category: Category; 
    public discount: Discount; 

    constructor(
        id: number, 
        name: string, 
        desc: string, 
        prices: Price[] = [],
        img: string, 
        stock: number, 
        status: string,
        category: Category, 
        discount: Discount,
    ) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.img = img;
        this.stock = stock;
        this.status = status;
        this.prices = prices;
        this.category = category;
        this.discount = discount;
    }
}
