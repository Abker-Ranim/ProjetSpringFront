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
      next: () => {
        this.spinner.hide();
        console.log('Données stockées:', {
          token: localStorage.getItem('auth_token'),
          role: localStorage.getItem('userRole'),
        });
        const role = this.authService.getRole();
        console.log('Rôle obtenu:', role);
        if (!role) {
          this.loginError = 'Erreur de rôle utilisateur';
          return;
        }
        // Redirection basée sur le rôle
        this.router.navigate([
          role === 'ADMIN' ? 'admin/home' : 'voluntary/event', 
        ]);
      },
      error: (err) => {
        this.spinner.hide();
        this.loginError =
          err.error?.message || 'Email ou mot de passe incorrect';
      },
    });
  }

  onSignup() {
    if (this.signupForm.invalid) return;

    this.spinner.show();
    this.signupError = null;

    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.spinner.hide();
        this.isSignUpMode = false; // Retour au mode login
        this.signupForm.reset(); // Réinitialise le formulaire
        // Message de succès
        this.loginError = 'Inscription réussie! Veuillez vous connecter.';
      },
      error: (err) => {
        this.spinner.hide();
        this.signupError = err.error?.message || "Erreur lors de l'inscription";
      },
    });
  }
}
