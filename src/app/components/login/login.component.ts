import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule,NgxSpinnerModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;
  faGoogle = faGoogle;

  // Forms
  loginForm: FormGroup;
  signupForm: FormGroup;

  // State
  isSignUpMode = false;
  loginError: string | null = null;
  signupError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Initialize signup form
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Toggle between login and signup
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.loginError = null;
    this.signupError = null;
  }

  // Handle login
  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show();
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    // Simulate API call
    setTimeout(() => {
      this.spinner.hide();

      // Test credentials (replace with real auth)
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        this.router.navigate(['/admin/home']);
      } else if (email === 'voluntary@example.com' && password === 'voluntary123') {
        localStorage.setItem('userRole', 'voluntary');
        this.router.navigate(['/voluntary/event']);
      } else {
        this.loginError = 'Invalid email or password';
      }
    }, 1000);
  }

  // Handle signup
  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }

    this.spinner.show();
    this.signupError = null;

    // Simulate API call
    setTimeout(() => {
      this.spinner.hide();

      // In a real app, you would call your signup API here
      // For demo purposes, we'll just log and redirect
      console.log('Signup data:', this.signupForm.value);
      localStorage.setItem('userRole', 'user');
      this.router.navigate(['/user/dashboard']);
    }, 1000);
  }
}
