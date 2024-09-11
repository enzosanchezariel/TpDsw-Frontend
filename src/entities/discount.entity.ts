export class Discount {
    public id: Number;
    public percentage: number;
    public units: number;

    constructor(id: Number, percentage: number, units: number) {
        this.id = id;
        this.percentage = percentage;
        this.units = units;
    }
}