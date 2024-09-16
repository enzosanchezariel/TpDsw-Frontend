import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Añade ReactiveFormsModule aquí
      declarations: [AuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});