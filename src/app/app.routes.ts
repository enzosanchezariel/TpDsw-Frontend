import { RouterModule, Routes } from '@angular/router';
import { IndexBodyComponent } from './index-body/index-body.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component'; // Importa tu componente de login
import { RegisterComponent } from './register/register.component'; // Importa tu componente de registro

export const routes: Routes = [
    { path: 'home', component: IndexBodyComponent },
    { path: 'productdetails/:id', component: ProductDetailsComponent },
    { path: 'login', component: LoginComponent },  // Ruta para el login
    { path: 'register', component: RegisterComponent },  // Ruta para el registro
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Ruta por defecto, redirige a 'home'
    { path: '**', redirectTo: '/home' }  // Ruta para manejar 404 o rutas no encontradas
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
