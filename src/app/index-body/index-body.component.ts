import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importar RouterModule y Router
import { ProductGridComponent } from "../product-grid/product-grid.component";

@Component({
  selector: 'app-index-body',
  standalone: true,
  imports: [ProductGridComponent, RouterModule],  // Asegúrate de importar RouterModule aquí
  templateUrl: './index-body.component.html',
  styleUrls: ['./index-body.component.scss']  // Cambié 'styleUrl' por 'styleUrls'
})
export class IndexBodyComponent {

  constructor(private router: Router) {}  // Inyectar el servicio Router

  navigateToCreateProduct(): void {
    this.router.navigate(['/create-product']);  // Método de navegación
  }
}
