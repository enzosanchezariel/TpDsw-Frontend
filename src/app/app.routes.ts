import { RouterModule, Routes } from '@angular/router';
import { IndexBodyComponent } from './index-body/index-body.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; 
import { ProductCreateComponent } from './product-create/product-create.component';

export const routes: Routes = [
    { path: 'home', component: IndexBodyComponent },
    { path: 'productdetails/:id', component: ProductDetailsComponent },
    { path: 'create-product', component: ProductCreateComponent }, 
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },  
    { path: '', redirectTo: '/home', pathMatch: 'full' },  
    { path: '**', redirectTo: '/home' } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
