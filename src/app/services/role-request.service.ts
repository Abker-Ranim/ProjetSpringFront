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
}