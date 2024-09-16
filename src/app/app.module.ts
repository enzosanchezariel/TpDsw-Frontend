import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { AppRoutingModule } from './app.routes.js';  // Importar el módulo de rutas
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Ensure AppRoutingModule is correctly defined and exported in app-routing.module.ts
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component'; // Importa AuthComponent
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component.js';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Ruta por defecto
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,  // Declarar el componente de login
    // AuthComponent // Declarar AuthComponent aquí
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule aquí
    AppRoutingModule,  // Importar las rutas
    AuthComponent, // Importar AuthComponent aquí
    FormsModule, // Añade FormsModule aquí
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
