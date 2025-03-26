import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string | null;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
        .pipe(
            tap((response) => {
                if (response.access_token) {
                    this.storeAuthData({
                        token: response.access_token,
                        role: response.role || 'VOLUNTEER' // Valeur par défaut
                    });
                }
            })
        );
}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/authenticate`, credentials)
      .pipe(
        tap((response) => {
          console.log('Réponse reçue:', response);

          if (response.access_token) {
            this.storeAuthData({
              token: response.access_token,
              role: response.role,
            });
          } else {
            console.error('Token non reçu dans la réponse');
          }
        })
      );
  }

  private storeAuthData(data: { token: string; role: string }): void {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('userRole', data.role);
    console.log('Données stockées:', {
      token: localStorage.getItem('auth_token'),
      role: localStorage.getItem('userRole'),
    });
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
