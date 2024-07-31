import { Component } from '@angular/core';
import { ProductGridComponent } from "../product-grid/product-grid.component";

@Component({
  selector: 'app-index-body',
  standalone: true,
  imports: [ProductGridComponent],
  templateUrl: './index-body.component.html',
  styleUrl: './index-body.component.scss'
})
export class IndexBodyComponent {

}
