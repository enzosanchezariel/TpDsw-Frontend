import { EventEmitter, Injectable } from '@angular/core';
import { ProductAmount } from '../../entities/productamount.entity';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Ticket } from '../../entities/ticket.entity';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3000/api/tickets';
  private product_amounts: ProductAmount[] = [];
  orderAdded = new EventEmitter<void>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCart(): ProductAmount[] {
    return this.product_amounts;
  }

  addToCart(pa: ProductAmount): void {
    this.product_amounts.push(pa);
    this.orderAdded.emit();
  }

  removeFromCart(index: number): void {
    this.product_amounts.splice(index, 1);
  }

  sendCart(): Observable<any> {
    return this.http.post<any>(this.apiUrl, 
      {
        access_token: this.authService.getToken,
        product_amounts: this.product_amounts
      }
    );
  }

  getUserTickets(): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/user/${this.authService.getUserTokenId()}`, { headers });
  }
}
