import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Team {
  id: number;
  name: string;
  description: string;
}
export interface RoleRequestDTO {
  id: number;
  requestedRole: string;
  status: string;
  comments?: string;
  userEmail: string;
  userName: string;
  eventTitle?: string;
  taskTitle?: string;
  teamName?: string;
  teamId?: number;
  experience?: string;
  description?: string;
  cvPath?: string;
  submittedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/team';
  private roleRequestUrl = 'http://localhost:8089/SpringMVC/api/v1/role-request';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getTeamsByEventId(eventId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.getHeaders(),
    });
  }

  createTeam(team: Team, eventId: number): Observable<Team> {
    const teamData = {
      name: team.name,
      description: team.description,
    };
    return this.http.post<Team>(`${this.apiUrl}?eventId=${eventId}`, teamData, {
      headers: this.getHeaders(),
    });
  }

  applyToTeam(
    teamId: number,
    eventId: number,
    application: { motivation: string; experience: string }
  ): Observable<RoleRequestDTO> {
    const payload = {
      requestedRole: 'RESPONSIBLE',
      eventId: eventId,
      teamId: teamId,
      description: application.motivation,
      experience: application.experience,
    };
    return this.http.post<RoleRequestDTO>(
      `${this.roleRequestUrl}/apply`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}