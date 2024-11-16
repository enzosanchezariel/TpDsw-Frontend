export class Discount {
    public id: number;
    public percentage: number;
    public units: number;

    constructor(id: number, percentage: number, units: number) {
        this.id = id;
        this.percentage = percentage;
        this.units = units;
    }
}