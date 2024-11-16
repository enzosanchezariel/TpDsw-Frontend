import { EventEmitter, Injectable } from '@angular/core';
import { ProductAmount } from '../../entities/productamount.entity';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = 'http://localhost:3000/api/tickets';
  private product_amounts: ProductAmount[] = [];
  orderAdded = new EventEmitter<void>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCart(): ProductAmount[] {
    const storedCart = localStorage.getItem('cart'); 
    if (storedCart) { 
      this.product_amounts = JSON.parse(storedCart); 
    } 
    return this.product_amounts;
  }

  addToCart(pa: ProductAmount): void {
    this.product_amounts.push(pa);
    localStorage.setItem('cart', JSON.stringify(this.product_amounts));
    this.orderAdded.emit();
  }

  removeFromCart(index: number): void {
    this.product_amounts.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.product_amounts));
  }

  sendCart(): Observable<any> {

    let PA = this.product_amounts.map(pa => {
      return {
        product: pa.product.id,
        amount: pa.amount
      }
    });

    return this.http.post<any>(this.apiUrl, 
      {
        access_token: this.authService.getToken(),
        product_amounts: PA
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

  getAllTickets(): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl, { headers }); // Asegúrate de que la URL esté correcta según tu API
  }

  deleteTicket(number: number): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.delete(`${this.apiUrl}/${number}`, { headers }).subscribe(() => {
      console.log('Ticket eliminado');
    });
  }

  resetCart() {
    this.product_amounts = [];
    localStorage.setItem('cart', JSON.stringify(this.product_amounts)); 
  }

  getTicketById(number: number): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/${number}`, { headers });
  }

  markInProgress(number: number) {
    this.http.patch(`${this.apiUrl}/${number}`, { access_token: this.authService.getToken(), state: "enEnvio" }).subscribe(() => {
      console.log('Ticket en envío');
    });
  }

  markAsSent(number: number) {
    this.http.patch(`${this.apiUrl}/${number}`, { access_token: this.authService.getToken(), state: "enviado" }).subscribe(() => {
      console.log('Ticket enviado');
    });
  }
}
