import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Product } from '../../entities/product.entity';
import { ProductsService } from '../services/products.service.js';
import { Price } from '../../entities/price.entity.js';
import { Category } from '../../entities/category.entity.js';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnChanges {
  @Input() cardInput!: Product;
  lastPrice: number | null = null;

  constructor(private service: ProductsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardInput'] && this.cardInput && this.cardInput.prices.length > 0) {
      this.lastPrice = this.cardInput.prices[this.cardInput.prices.length - 1].price;
    }
  }
}
