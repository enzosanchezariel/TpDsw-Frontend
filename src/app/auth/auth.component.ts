import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // Importa los módulos necesarios
})
export class AuthComponent implements OnInit {
onSignUp() {
throw new Error('Method not implemented.');
}
  authForm!: FormGroup;
isSignUp: any;
  signUpForm!: FormGroup<any>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      console.log(this.authForm.value);
    }
  }

  toggleSignUp(): void {
    // Lógica para cambiar a la vista de registro
  }
}