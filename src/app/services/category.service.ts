import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../entities/category.entity';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/'; // Corregido con el protocolo HTTP


  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    const url = this.baseUrl + 'categories';
    return this.http.post<any>(url, category);
  }

  getCategories(): Observable<any> {
    const url = this.baseUrl + 'categories';
    return this.http.get<any>(url);
  }

  getCategoryById(id: string): Observable<any> {
    const url = this.baseUrl + 'categories/' + id;
    return this.http.get<any>(url);
  }
}
