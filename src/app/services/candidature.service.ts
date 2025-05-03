import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Candidate {
  id: string;
  name: string; // Maps to userName
  email: string; // Maps to userEmail
  eventName: string; // Maps to eventTitle
  taskName: string; // Maps to taskTitle
  teamName: string ;
  motivation: string; // Maps to description
  experience: string | null; // Maps to experience
  cvUrl: string; // Maps to cvPath
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Maps to status
  submissionDate: string; // Maps to submittedAt
}

interface RoleRequestDTO {
  id: number;
  requestedRole: string;
  status: string;
  comments: string | null;
  userEmail: string;
  userName: string;
  eventTitle: string;
  taskTitle: string;
  teamName: string ;
  description: string | null;
  experience: string | null;
  cvPath: string | null;
  submittedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/role-request';
  private baseUrl = 'http://localhost:8089'; // Base URL for CV path

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getUserCandidatures(): Observable<Candidate[]> {
    return this.http
      .get<RoleRequestDTO[]>(`${this.apiUrl}/pending-by-user`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((requests) => this.mapToCandidates(requests)),
        catchError((error) => {
          console.error('Error fetching user candidatures:', error);
          return throwError(() => new Error('Failed to fetch user candidatures'));
        })
      );
  }

  getVolunteerCandidaturesForResponsible(): Observable<Candidate[]> {
    return this.http
      .get<RoleRequestDTO[]>(`${this.apiUrl}/volunteer-by-responsible`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((requests) => this.mapToCandidates(requests)),
        catchError((error) => {
          console.error('Error fetching volunteer candidatures:', error);
          return throwError(() => new Error('Failed to fetch volunteer candidatures'));
        })
      );
  }

  getCandidateById(id: string): Observable<Candidate> {
    return this.http
      .get<RoleRequestDTO>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((request) => {
          const candidate = this.mapToCandidate(request);
          console.log('Constructed CV URL:', candidate.cvUrl); // Debug
          return candidate;
        }),
        catchError((error) => {
          console.error('Error fetching candidate details:', error);
          return throwError(() => new Error('Failed to fetch candidate details'));
        })
      );
  }

  updateCandidateStatus(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    comments?: string
  ): Observable<void> {
    const params = new URLSearchParams();
    params.set('status', status);
    if (comments) {
      params.set('comments', comments);
    }

    return this.http
      .put<void>(
        `${this.apiUrl}/${requestId}/review-volunteer?${params.toString()}`,
        null,
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating candidate status:', error);
          return throwError(() => new Error('Failed to update candidate status'));
        })
      );
  }

  private mapToCandidates(requests: RoleRequestDTO[]): Candidate[] {
    return requests.map((request) => this.mapToCandidate(request));
  }

  private mapToCandidate(request: RoleRequestDTO): Candidate {
    const cvFilename = request.cvPath
    ? request.cvPath.replace(/^.*[\\\/]/, '')
    : '';
    return {
      id: request.id.toString(),
      name: request.userName || request.userEmail.split('@')[0],
      email: request.userEmail,
      eventName: request.eventTitle ,
      taskName: request.taskTitle ,
      teamName: request.teamName,
      motivation: request.description || 'No motivation provided',
      experience: request.experience || 'No experience provided',
      cvUrl: cvFilename ? `${this.baseUrl}/uploads/cvs/${cvFilename}` : '',
      status: request.status as 'PENDING' | 'APPROVED' | 'REJECTED',
      submissionDate: request.submittedAt,
    };
  }
}