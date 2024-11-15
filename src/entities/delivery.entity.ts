export class Delivery {
    tracking_number: string;
    date: Date;
    constructor(tracking_number: string, date: Date) {
        this.tracking_number = tracking_number;
        this.date = date;
    }
}