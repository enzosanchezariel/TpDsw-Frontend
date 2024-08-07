import { Component } from '@angular/core';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { IndexBodyComponent } from "../index-body/index-body.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [AppHeaderComponent, IndexBodyComponent, RouterOutlet],
  templateUrl: './app-main.component.html',
  styleUrl: './app-main.component.scss'
})
export class AppMainComponent {

}
