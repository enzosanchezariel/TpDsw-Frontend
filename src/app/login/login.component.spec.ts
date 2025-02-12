import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';

class MockAuthService {
  login(email: string, password: string) {
    return of({});
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('Debe evitar enviar el formulario y mostrar un error cuando hay campos en blanco', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(component.showErrorModal).toBeTrue();
    expect(component.errorMessage).toBe('Por favor, ingrese su correo electrónico y contraseña.');
  });

  it('Debe llamar login de AuthService cuando se envía el formulario', () => {
    spyOn(authService, 'login').and.returnValue(of({}));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});