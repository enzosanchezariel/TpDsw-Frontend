export class Category {
    public id: Number;
    public name: string;
    public status: string;

    constructor(id: Number, name: string, status: string) {
        this.id = id;
        this.name = name;
        this.status = 'active';
    }
}