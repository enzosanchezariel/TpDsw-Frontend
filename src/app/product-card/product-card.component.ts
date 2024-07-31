import { Component, Input } from '@angular/core';

type CardContent = {
  id: Number;
  desc: string;
  price: Number;
  imageUrl: string;
};

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() cardInput!: CardContent;
}
