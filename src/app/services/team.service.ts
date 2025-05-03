import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Team {
  id: number; // Changé de string à number pour correspondre à TeamDTO
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/team';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTeamsByEventId(eventId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/event/${eventId}`, { headers: this.getHeaders() });
  }

  createTeam(team: Team, eventId: number): Observable<Team> {
    const teamData = {
      name: team.name,
      description: team.description
    };
    return this.http.post<Team>(`${this.apiUrl}?eventId=${eventId}`, teamData, { headers: this.getHeaders() });
  }
}