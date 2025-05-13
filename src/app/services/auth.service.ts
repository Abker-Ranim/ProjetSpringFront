import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface User {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
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
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeUserFromStorage();

  }

  private initializeUserFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUser = {
          id: decoded.sub || decoded.id,
          firstname: decoded.firstname,
          lastname: decoded.lastname,
          email: decoded.email,
          role: decoded.role || localStorage.getItem('userRole') || 'VOLUNTARY'
        };
      } catch (e) {
        console.error('Error decoding token', e);
        this.clearAuthData();
      }
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
        .pipe(
            tap((response) => {
                if (response.access_token) {
                    this.storeAuthData({
                      access_token: response.access_token,
                      role: response.role || 'VOLUNTARY' 
                      ,
                      refresh_token: null
                    });
                }
            })
        );
}

login(credentials: LoginRequest): Observable<AuthResponse> {
  return this.http
    .post<AuthResponse>(`${this.apiUrl}/authenticate`, credentials)
    .pipe(
      tap({
        next: (response) => {
          console.log('Réponse reçue:', response);

          if (response.access_token) {
            this.storeAuthData({
              access_token: response.access_token,
              role: response.role,
              refresh_token: null
            });
          } else {
            console.error('Login error:', 'Token non reçu dans la réponse');
          }
        },
        error: (error) => {
          // Affiche l'erreur en cas de problème
          console.error('Login error:', error);
        }
      })
    );
}


  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    const decoded: any = jwtDecode(response.access_token);
    this.currentUser = {
      id: decoded.sub || decoded.id,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      email: decoded.email,
      role: decoded.role || response.role || 'VOLUNTARY'
    };
    
    localStorage.setItem('userRole', this.currentUser.role);
    localStorage.setItem('userEmail', this.currentUser.email);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }


  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    this.currentUser = null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  isAdmin(): boolean {
    return this.getRole()?.toUpperCase() === 'ADMIN';
  }

  isVOLUNTARY(): boolean {
    return this.getRole()?.toUpperCase() === 'VOLUNTARY';
  }
  logout(): Observable<string> {
    const token = this.getToken();
    if (!token) {
      console.warn('No token found, clearing local storage');
      localStorage.clear();
      return new Observable((observer) => {
        observer.next('Successfully logged out');
        observer.complete();
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<string>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        console.log('Logout request successful, clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
      })
    );
  }
}
