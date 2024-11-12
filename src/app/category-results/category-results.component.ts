import { Component } from '@angular/core';
import { Product } from '../../entities/product.entity';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { ProductGridComponent } from "../product-grid/product-grid.component";
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-results',
  standalone: true,
  imports: [ProductGridComponent, CommonModule],
  templateUrl: './category-results.component.html',
  styleUrl: './category-results.component.scss'
})
export class CategoryResultsComponent {
  categoryName: string = '';
  categoryId: string | null = '';
  categoryResults: Product[] = [];

  constructor(private route: ActivatedRoute, private productsService: ProductsService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id')

      if (this.categoryId !== null) {
      
        this.categoryService.getCategoryById(this.categoryId).subscribe((response) => {
          this.categoryName = response.data.name;
          this.performSearch();
        });

      }

    });
  }

  performSearch(): void {
    this.productsService.getAllProducts().subscribe((response) => {
      this.categoryResults = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].category.id.toString() === this.categoryId) {
          this.categoryResults.push(response.data[i]);
        }
      }
    });
  }
}