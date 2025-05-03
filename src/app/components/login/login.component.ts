import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
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
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUser = faUser;

  loginForm: FormGroup;
  signupForm: FormGroup;
  isSignUpMode = false;
  loginError: string | null = null;
  signupError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.loginError = null;
    this.signupError = null;
    this.loginForm.reset();
    this.signupForm.reset();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginError = 'Please fill in all required fields correctly';
      return;
    }

    this.spinner.show();
    this.loginError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.spinner.hide();
        if (!response.access_token || !response.role) {
          this.loginError = 'Invalid response from server';
          return;
        }

        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('userRole', response.role);

        const role = response.role.toLowerCase();
        this.router.navigate([`/${role}/event`]).catch(err => {
          this.loginError = 'Navigation error: ' + err.message;
        });
      },
      error: (err) => {
        this.spinner.hide();
        this.loginError = err.error?.message || 'Incorrect email or password';
        console.error('Login error:', err);
      },
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.signupError = 'Please fill in all required fields correctly';
      return;
    }

    this.spinner.show();
    this.signupError = null;

    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.spinner.hide();
        this.isSignUpMode = false;
        this.signupForm.reset();
        this.loginError = 'Registration successful! Please log in.';
      },
      error: (err) => {
        this.spinner.hide();
        this.signupError = err.error?.message || 'Error during registration';
        console.error('Signup error:', err);
      },
    });
  }
}