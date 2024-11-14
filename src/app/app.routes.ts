import { RouterModule, Routes } from '@angular/router';
import { IndexBodyComponent } from './index-body/index-body.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'; 
import { ProductCreateComponent } from './product-create/product-create.component';
import { CrudCategory } from './crud-category/crud-category.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './search-results/search-results.component.js';
import { UserSettingsComponent } from './user-settings/user-settings.component.js';
import { RemoveUserComponent } from './remove-user/remove-user.component.js';
import { CategoryResultsComponent } from './category-results/category-results.component.js';
import { CrudDiscountComponent } from './crud-discount/crud-discount.component.js';
import { UserListComponent } from './user-list/user-list.component.js';
import { CrudProducts } from './crud-product/crud-product.component';


export const routes: Routes = [
    { path: 'home', component: IndexBodyComponent },
    { path: 'productdetails/:id', component: ProductDetailsComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'create-product', component: ProductCreateComponent }, 
    { path: 'crud-category', component: CrudCategory },
    { path: 'category-results/:id', component: CategoryResultsComponent },
    { path: 'edit-product/:id', component: EditProductComponent },
    { path: 'crud-discount', component: CrudDiscountComponent },
    { path: 'login', component: LoginComponent }, 
    { path: 'register', component: RegisterComponent }, 
    { path: 'user-list', component: UserListComponent },
    { path: 'remove-user', component: RemoveUserComponent },
    { path: 'user-settings/:email', component: UserSettingsComponent },
    { path: 'crud-product', component: CrudProducts },
    { path: 'search-results', component: SearchResultsComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },  
    { path: '**', redirectTo: '/home' } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
