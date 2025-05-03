import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  organization: string;
  vision: string;
  participants: number;
  imagePath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1/event';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEvent(event: Event, image?: File): Observable<Event> {
    const formData = new FormData();
    formData.append('event', new Blob([JSON.stringify(event)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Event>(`${this.apiUrl}/create`, formData, { headers: this.getHeaders() });
  }
}