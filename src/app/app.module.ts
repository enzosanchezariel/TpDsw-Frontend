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
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component.js';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ProductGridComponent } from "./product-grid/product-grid.component";
import { UserSettingsComponent } from './user-settings/user-settings.component.js';
import { RemoveUserComponent } from './remove-user/remove-user.component.js';
import { CategoryResultsComponent } from './category-results/category-results.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: 'category-results/:id', component: CategoryResultsComponent },
  { path: 'create-categoty', component: CreateCategoryComponent},
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-settings/:email', component: UserSettingsComponent },
  { path: 'search-results', component: SearchResultsComponent },
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
    CreateCategoryComponent,
    EditProductComponent,
    SearchResultsComponent,
    UserSettingsComponent,
    RemoveUserComponent,
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
    ProductGridComponent
],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
