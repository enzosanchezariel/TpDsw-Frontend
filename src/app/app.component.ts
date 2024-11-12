import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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