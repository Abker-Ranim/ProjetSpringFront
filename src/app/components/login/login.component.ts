import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  loginForm!: FormGroup;
  loginError: boolean = false;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();
    this.loginError = false;

    const { email, password } = this.loginForm.value;

    // Simulation d'authentification front-end
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        this.router.navigate(['/admin/home']);
      } else if (
        email === 'responsible@example.com' &&
        password === 'responsible123'
      ) {
        localStorage.setItem('userRole', 'responsible');
        this.router.navigate(['/responsible/event']);
      } else if (
        email === 'voluntary@example.com' &&
        password === 'voluntary123'
      ) {
        localStorage.setItem('userRole', 'voluntary');
        this.router.navigate(['/voluntary/home']);
      } else {
        this.loginError = true;
        console.error('Invalid login credentials');
      }
      this.spinner.hide();
    }, 500); // Délai simulé pour l'effet de chargement
  }
}
