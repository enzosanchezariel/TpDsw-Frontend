import { Component, signal, Signal } from '@angular/core';
import {CommonModule} from '@angular/common'
import { ProductCardComponent } from "../product-card/product-card.component";
import { Product } from '../../entities/product.entity';
import { ProductsService } from '../products.service';


@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {

  cards: Product[] = [];

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts() {
    this.service.getAllProducts().subscribe((response) => this.cards = response.data)
  }
}
