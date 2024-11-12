import { RouterModule, Routes } from '@angular/router';
import { IndexBodyComponent } from './index-body/index-body.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; 
import { ProductCreateComponent } from './product-create/product-create.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './search-results/search-results.component.js';
import { UserSettingsComponent } from './user-settings/user-settings.component.js';
import { RemoveUserComponent } from './remove-user/remove-user.component.js';
import { CategoryResultsComponent } from './category-results/category-results.component.js';

export const routes: Routes = [
    { path: 'home', component: IndexBodyComponent },
    { path: 'productdetails/:id', component: ProductDetailsComponent },
    { path: 'create-product', component: ProductCreateComponent }, 
    { path: 'create-category', component: CreateCategoryComponent },
    { path: 'category-results/:id', component: CategoryResultsComponent },
    { path: 'edit-product/:id', component: EditProductComponent },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent },  
    { path: 'remove-user', component: RemoveUserComponent },
    { path: 'user-settings/:email', component: UserSettingsComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'search-results', component: SearchResultsComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },  
    { path: '**', redirectTo: '/home' } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
