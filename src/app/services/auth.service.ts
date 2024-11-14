import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../entities/user.entity';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Cambia esto a tu URL de backend
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRole());

  constructor(private http: HttpClient) {}

  // Método para hacer login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        const accessToken = (response as any).data.access_token;
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('role', (response as any).data.role);
          localStorage.setItem('email', email);
          this.isAuthenticatedSubject.next(true);  // Actualiza el estado de autenticación
          this.userRoleSubject.next((response as any).data.role);  // Actualiza el rol
        }
      })
    );
  }

  // Método para obtener el email del usuario desde localStorage
  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Verifica si el usuario está autenticado
  private checkAuthentication(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Método para obtener el rol del usuario desde localStorage
  getRole(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    } else {
      return localStorage.getItem('role');
    }
  }

  // Método para hacer logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.isAuthenticatedSubject.next(false);  // Actualiza el estado de autenticación
    this.userRoleSubject.next(null);  // Limpia el rol
  }

  // Método para registrarse
  signUp(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  // Métodos observables para obtener el estado de autenticación y rol de manera reactiva
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userRole$(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }
}
