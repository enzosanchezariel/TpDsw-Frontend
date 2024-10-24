export class Price {
    public date: Date;
    public price: number;
    public id: number; 

    constructor(date: Date, price: number, id: number = 0) {
        this.date = date;
        this.price = price;
        this.id = id;
    }
}
