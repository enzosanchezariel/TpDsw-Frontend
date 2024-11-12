import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../entities/product.entity';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  
  searchQuery: string = '';
  searchResults: Product[] = [];

  constructor(private route: ActivatedRoute, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'];
      this.performSearch();
    });
  }

  performSearch(): void {
    this.productsService.searchProducts(this.searchQuery).subscribe((response) => {
      this.searchResults = response.data;
    });
  }
  
}
