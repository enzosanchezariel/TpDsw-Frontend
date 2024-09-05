export class Product {
    public id: Number;
    public name: string;
    public desc: string;
    public price: Number;
    public img: string;
    public stock: number;

    constructor(id: Number, name: string, desc: string, price: Number, img: string, stock: number) {
        this.stock = stock;
        this.price = price;
        this.desc = desc;
        this.name = name;
        this.img = img;
        this.id = id;
    }
}