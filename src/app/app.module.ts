import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes'; 
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component.js';
import { ProductCreateComponent } from './product-create/product-create.component'; 
import { CrudCategory } from './crud-category/crud-category.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component.js';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ProductGridComponent } from "./product-grid/product-grid.component";
import { UserSettingsComponent } from './user-settings/user-settings.component.js';
import { RemoveUserComponent } from './remove-user/remove-user.component.js';
import { CategoryResultsComponent } from './category-results/category-results.component';
import { CrudDiscountComponent } from './crud-discount/crud-discount.component.js';
import { UserListComponent } from './user-list/user-list.component.js';
import { CrudProducts } from './crud-product/crud-product.component';
import { AdminOrderListComponent } from './delivery-list/delivery-list.component.js';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: 'category-results/:id', component: CategoryResultsComponent },
  { path: 'crud-categoty', component: CrudCategory},
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'crud-discount', component: CrudDiscountComponent },
  { path: 'user-settings/:email', component: UserSettingsComponent },
  { path: 'crud-product', component: CrudProducts },
  { path: 'delivery-list', component: AdminOrderListComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'remove-user', component: RemoveUserComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    RegisterComponent,
    ProductCreateComponent,
    CrudCategory,
    EditProductComponent,
    SearchResultsComponent,
    UserSettingsComponent,
    RemoveUserComponent,
    CrudDiscountComponent,
    UserListComponent,
    CrudProducts,
    
      ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    AuthComponent,
    AppHeaderComponent,
    ProductGridComponent,
    AdminDashboardComponent,
    AdminOrderListComponent
],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
