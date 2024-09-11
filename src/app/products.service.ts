import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../entities/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  readonly baseUrl = 'http://localhost:3000/api/';
  
  constructor(private http: HttpClient) { }

  getAllProducts() {
    const url = this.baseUrl + 'products';
    return this.http.get<any>(url);
  }

  getOneProduct(id: string) {
    const url = this.baseUrl + 'products/' + id;
    return this.http.get<any>(url);
  }
}
