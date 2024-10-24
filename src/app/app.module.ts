import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';  // Importar el módulo de rutas
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Importa tus componentes
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component'; // Importa AuthComponent
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component.js';
import { ProductCreateComponent } from './product-create/product-create.component'; // Asegúrate de importar el ProductCreateComponent

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-product', component: ProductCreateComponent }, // Asegúrate de agregar la ruta para el ProductCreateComponent
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Ruta por defecto
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,  // Declarar el componente de login
    RegisterComponent,
    ProductCreateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule aquí
    HttpClientModule,
    RouterModule.forRoot(routes),
    AppRoutingModule, // Importar las rutas
    AuthComponent
],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
