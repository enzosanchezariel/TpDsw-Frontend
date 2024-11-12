import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerData = {
    dni:' ',
    name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.registerData.dni && this.registerData.name && this.registerData.last_name && this.registerData.email && this.registerData.password) {
      this.http.post('http://localhost:3000/api/users', this.registerData).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error en el registro', error);
        }
      );
    }
  }
}
