import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthComponent } from "../auth/auth.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthComponent],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss'
})
export class AppFooterComponent {
isLoginFormOpen: any;
}