import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../entities/user.entity';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';  // Cambia esto a tu URL de backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if ((response as any).data.access_token) {
          localStorage.setItem('access_token', (response as any).data.access_token);
          localStorage.setItem('role', (response as any).data.role);
          localStorage.setItem('email', email);
        }
      })
    );
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  private setToken(access_token: string): void {
    localStorage.setItem('access_token', access_token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  getRole(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    } else {
      return localStorage.getItem('role');
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  signUp(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }
}
