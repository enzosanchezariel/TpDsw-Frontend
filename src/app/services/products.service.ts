import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity'; // Ajusta la importación según la ubicación real
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllProducts(): Observable<any> {
    const url = this.baseUrl + 'products';
    return this.http.get<any>(url);
  }

  getOneProduct(id: string): Observable<any> {
    const url = this.baseUrl + `products/${id}`;
    return this.http.get<any>(url);
  }

  createProduct(product: Product): Observable<any> {
    (product as any).access_token = this.authService.getToken()
    const url = this.baseUrl + 'products'; // Asegúrate de que la ruta sea correcta
    return this.http.post<any>(url, product); // Envía el producto al backend
  }

  // Método para obtener todas las categorías (agrega este método)
  getCategories(): Observable<Category[]> {
    const url = this.baseUrl + 'categories'; // Ajusta según la ruta de tu API
    return this.http.get<Category[]>(url); // Asegúrate de que el tipo de retorno sea Category[]
  }

  updateProduct(id: string, product: Product): Observable<any> {
    const url = this.baseUrl + `products/${id}`;
    return this.http.put<any>(url, product);
  }

  searchProducts(nameQuery: string): Observable<any> {
    const url = `${this.baseUrl}products/search?name=${nameQuery}`;  // Construir la URL con el parámetro 'name'
    return this.http.get<any>(url);  // Realizar la solicitud GET
  }

  deleteProduct(id:string): Observable<any>{
    const url = this.baseUrl + `products/${id}`;
    return this.http.delete<any>(url);
  }

  deactivateProduct(id: string, product: Product): Observable<any> {
    const url = this.baseUrl + `products/${id}`;
    return this.http.patch<any>(url, product);
  }

}
