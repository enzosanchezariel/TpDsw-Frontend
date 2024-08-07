import { Routes } from '@angular/router';
import { IndexBodyComponent } from './index-body/index-body.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
    {path: 'home', component: IndexBodyComponent},
    {path: 'productdetails/:id', component: ProductDetailsComponent},
    {path: '', component: IndexBodyComponent},
];
