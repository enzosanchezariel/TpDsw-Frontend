import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity'; // Define la entidad User según tu estructura

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/'; // URL base de la API para usuarios

  constructor(private http: HttpClient) {}

  // Obtener los datos del usuario
  getUserData(email: string): Observable<any> {
    const url = this.apiUrl + `users/${email}`; // Construye la URL con el correo electrónico del usuario
    return this.http.get<any>(url);
  }

  // Actualizar los datos del usuario
  updateUserData(email: string, updatedUser: User): Observable<any> {
    const url = this.apiUrl + `users/${email}`; // Construye la URL con el correo electrónico del usuario
    return this.http.put<any>(url, updatedUser); // Envía el usuario completo para actualizar
  }

  removeUser(email: string): Observable<any> {
    const url = this.apiUrl + `users/${email}`;
    return this.http.delete<any>(url);
  }

  getUsers(): Observable<any> {
    const url = this.apiUrl + 'users';
    return this.http.get<any>(url);
  }

  changeUserRole(email: string, role: string): Observable<any> {
    const url = this.apiUrl + `users/${email}/role`;
    return this.http.put<any>(url, { role });
  }
  
}
