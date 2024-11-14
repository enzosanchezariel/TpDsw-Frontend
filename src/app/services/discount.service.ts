import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from '../../entities/discount.entity';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private baseUrl = 'http://localhost:3000/api/'; // Corregido con el protocolo HTTP

  constructor(private http: HttpClient) {}

  createDiscount(discount: Discount): Observable<Discount> {
    const url = this.baseUrl + 'discounts';
    return this.http.post<any>(url, discount);
  }

  getDiscounts(): Observable<any> {
    const url = this.baseUrl + 'discounts';
    return this.http.get<any>(url);
  }

  getDiscountById(id: string): Observable<any> {
    const url = this.baseUrl + 'discounts/' + id;
    return this.http.get<any>(url);
  }

  updateDiscount(id: string, discount: Discount): Observable<any> {
    const url = this.baseUrl + `discounts/${id}`;
    return this.http.put<any>(url, discount);
  }

  deleteDiscount(id: string): Observable<any> {
    const url = this.baseUrl + `discounts/${id}`;
    return this.http.delete<any>(url);
  }
}