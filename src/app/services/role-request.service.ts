import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoleRequest {
  id: number;
  requestedRole: string;
  status: string;
  comments: string | null;
  userEmail: string;
  taskId: number | null;
  posteId: number | null;
  eventId: number;
  description: string | null;
  cvPath: string | null;
  submittedAt: string;
}
export interface RoleRequestDTO {
  id: number;
  requestedRole: string;
  status: string;
  comments: string | null;
  userEmail: string;
  userName: string;
  eventTitle: string | null;
  taskTitle: string | null;
  teamName: string | null;
  description: string | null;
  cvPath: string | null;
  submittedAt: string | null;
  experience: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class RoleRequestService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/role-request';

  constructor(private http: HttpClient) {}

  getPendingPosteCandidatures(): Observable<RoleRequest[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    });
    return this.http.get<RoleRequest[]>(`${this.apiUrl}/pending/postes`, { headers });
  }

  reviewRoleRequest(requestId: number, status: string, comments: string | null): Observable<RoleRequest> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    });
    const params: any = { status };
    if (comments) {
      params.comments = comments;
    }
    return this.http.put<RoleRequest>(`${this.apiUrl}/${requestId}`, null, { headers, params });
  }

  getTeamResponsibleRequestsByUser(): Observable<RoleRequestDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authentication token if needed
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<RoleRequestDTO[]>(`${this.apiUrl}/team-responsible-by-user`, { headers });
  }

  getAllTeamResponsibleRequests(): Observable<RoleRequestDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authentication token if needed
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<RoleRequestDTO[]>(`${this.apiUrl}/team-responsible-all`, { headers });
  }

  reviewResponsibleRequest(requestId: number, status: string, comments?: string): Observable<RoleRequestDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authentication token if needed
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    const params: any = { status };
    if (comments) {
      params.comments = comments;
    }
    return this.http.put<RoleRequestDTO>(`${this.apiUrl}/${requestId}/review`, null, { headers, params });
  }
}