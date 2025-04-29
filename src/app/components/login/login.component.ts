import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxSpinnerModule,
  ],
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
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Initialize signup form
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Toggle between login and signup
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.loginError = null;
    this.signupError = null;
  }

  // Handle login
  onLogin() {
    if (this.loginForm.invalid) return;

    this.spinner.show();
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.spinner.hide();
        console.log('Response received from backend:', response);

        if (!response.access_token) {
          this.loginError = 'Error: Token not received';
          return;
        }

        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('userRole', response.role);

        console.log('Stored data:', {
          token: localStorage.getItem('auth_token'),
          role: localStorage.getItem('userRole'),
        });

        const role = this.authService.getRole();
        console.log('Role obtained:', role);

        if (!role) {
          this.loginError = 'Error: User role not found';
          return;
        }

        // Role-based redirection
        this.router.navigate([role.toLowerCase(), 'event']);
      },
      error: (err) => {
        this.spinner.hide();
        this.loginError = err.error?.message || 'Incorrect email or password';
        console.error('Login error:', err);
      },
    });
  }

  // Handle signup
  onSignup() {
    if (this.signupForm.invalid) return;

    this.spinner.show();
    this.signupError = null;

    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.spinner.hide();
        this.isSignUpMode = false;
        this.signupForm.reset();
        this.signupError = null; // Reset signup error
        this.loginError = 'Registration successful! Please log in.';
      },
      error: (err) => {
        this.spinner.hide();
        this.signupError = err.error?.message || 'Error during registration';
      },
    });
  }
}