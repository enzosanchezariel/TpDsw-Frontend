import { Component, signal, Signal } from '@angular/core';
import {CommonModule} from '@angular/common'
import { ProductCardComponent } from "../product-card/product-card.component";

type CardContent = {
  id: Number;
  desc: string;
  price: Number;
  imageUrl: string;
};

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {
  cards = signal<CardContent[]>([]);

  names = [
    "Mayonesa", "Mostaza", "Café", "Cinta", "Escoba",
    "Costillar", "Fideos", "Coca-Cola", "Pepsi", "Bolsas de basura", 
    "Guantes", "Papel higienico", "Lavandina", "Shampoo", "Jabón", 
    "Vino", "Gel", "Rollos de cocina", "Maquina de afeitar", "Pilas AA", 
  ];

  constructor() {
    const cards: CardContent[] = [];
    for (let i = 0; i < this.names.length; i++) {
      cards.push({
        id: i,
        desc: this.names[i],
        imageUrl: "https://picsum.photos/200",
        price: 200
      });
    }

    this.cards.set(cards);
  }
}
