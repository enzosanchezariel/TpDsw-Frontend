import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { ProductCardComponent } from "../product-card/product-card.component";

import { MatCardModule } from '@angular/material/card';

type CardContent = {
  id: Number;
  name: string;
  imageUrl: string;
};

@Component({
    selector: 'app-product-grid',
    standalone: true,
    templateUrl: './product-grid.component.html',
    styleUrl: './product-grid.component.css',
    imports: [ProductCardComponent, CommonModule, MatCardModule]
})

export class ProductGridComponent{
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
        name: this.names[i],
        imageUrl: "https://picsum.photos/200",
      });
    }

    this.cards.set(cards);
  }
}