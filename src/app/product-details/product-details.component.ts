import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../../entities/product.entity';
import { FormsModule } from '@angular/forms';
import { Price } from '../../entities/price.entity';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  constructor(private route: ActivatedRoute, private service: ProductsService) {}

  amount: number = 0;
  total : number = 0;

  id : string | null = null;
  product: Product = new Product(0, '', '', [new Price(new Date(), 0)], '', 0, {}, {});
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => this.id = params.get('id'));
    if (this.id !== null) {
      this.service.getOneProduct(this.id).subscribe((response) => this.product = response.data);
    }
  }
}
