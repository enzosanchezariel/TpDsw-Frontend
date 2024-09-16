import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  title = 'my-app';
  authForm!: FormGroup;
}