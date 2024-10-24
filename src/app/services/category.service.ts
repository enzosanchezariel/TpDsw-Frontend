import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../entities/category.entity';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories'; // Corregido con el protocolo HTTP

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
