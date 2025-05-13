import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Poste {
  id: number; // Changé de string à number pour correspondre à Long
  title: string;
  description: string;
  status: string;
  competences: string[];
  teamId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PosteService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/poste';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPostesByTeamId(teamId: number): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.apiUrl}/team/${teamId}`, { headers: this.getHeaders() });
  }

  getPostesByEventId(eventId: number): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.apiUrl}/event/${eventId}`, { headers: this.getHeaders() });
  }
  getPosteById(id: number): Observable<Poste> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    });
    return this.http.get<Poste>(`${this.apiUrl}/${id}`, { headers });
  }
}