import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'ToDo' | 'InProgress' | 'Done';
  deadline?: string;
  note?: number;
  responsibleName: string;
  teamId?: number;
  eventId?: number;
  createdAt?: string;
  completedAt?: string;
  comments: TaskComment[];
  volunteerName?: string;
}

export interface TaskComment {
  id: number;
  userId: string;
  userEmail: string;
  content: string;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface RoleRequest {
  id: number;
  requestedRole: string;
  status: string;
  userEmail: string;
  taskId?: number;
  description?: string;
  cvPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8089/SpringMVC/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createTask(taskData: any): Observable<Task> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/task/create`, taskData, { headers })
      .pipe(
        map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || []
        })),
        catchError((error) => {
          console.error('Error creating task:', error);
          return throwError(() => new Error('Failed to create task'));
        })
      );
  }

  getTasksByResponsible(): Observable<Task[]> {
    return this.http.get<any[]>(`${this.apiUrl}/task/responsible`, { headers: this.getHeaders() })
      .pipe(
        map(tasks => tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || []
        }))),
        catchError((error) => {
          console.error('Error fetching responsible tasks:', error);
          return throwError(() => new Error('Failed to fetch responsible tasks'));
        })
      );
  }

  getTasksByVolunteer(): Observable<Task[]> {
    return this.http.get<any[]>(`${this.apiUrl}/task/volunteer`, { headers: this.getHeaders() })
      .pipe(
        map(tasks => tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          volunteerName: task.volunteerName,
          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || [
            {
              id: '1',
              userId: 'admin',
              userName: 'Admin User',
              content: 'Ceci est un commentaire statique pour la tâche.',
              createdAt: '2025-05-02T10:30:00'
            }
          ]
        }))),
        catchError((error) => {
          console.error('Error fetching volunteer tasks:', error);
          return throwError(() => new Error('Failed to fetch volunteer tasks'));
        })
      );
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<any[]>(`${this.apiUrl}/task`, { headers: this.getHeaders() })
      .pipe(
        map(tasks => tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          volunteerName: task.volunteerName,

          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || []
        }))),
        catchError((error) => {
          console.error('Error fetching all tasks:', error);
          return throwError(() => new Error('Failed to fetch all tasks'));
        })
      );
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/team`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching teams:', error);
          return throwError(() => new Error('Failed to fetch teams'));
        })
      );
  }

  applyForVolunteer(taskId: number, description: string, cv: File | null): Observable<RoleRequest> {
    const formData = new FormData();
    const request = {
      requestedRole: 'VOLUNTARY',
      taskId: taskId,
      description: description,
      eventId: null,
      teamId: null
    };

    console.log('Request payload:', request);
    formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    if (cv) {
      formData.append('cv', cv, cv.name);
    }

    const headers = this.getHeaders();
    console.log('Headers:', headers);

    return this.http.post<RoleRequest>(`${this.apiUrl}/role-request/apply-volunteer`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error applying for volunteer:', error);
          let errorMessage = 'Failed to submit application';
          if (error.status === 403) {
            errorMessage = 'You are not authorized to apply for this task';
          } else if (error.status === 400) {
            errorMessage = 'Invalid application data. Please check your input.';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateTaskStatus(taskId: number, newStatus: 'ToDo' | 'InProgress' | 'Done'): Observable<Task> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/task/${taskId}/update-status?newStatus=${newStatus}`, {}, { headers })
      .pipe(
        map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          volunteerName: task.volunteerName,

          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || []
        })),
        catchError((error) => {
          console.error('Error updating task status:', error);
          return throwError(() => new Error('Failed to update task status'));
        })
      );
  }

  assignTaskNote(taskId: number, note: number): Observable<Task> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/task/${taskId}/assign-note?note=${note}`, {}, { headers })
      .pipe(
        map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          teamId: task.teamId,
          eventId: task.eventId,
          responsibleName: task.responsibleName,
          volunteerName: task.volunteerName,

          note: task.note,
          deadline: task.deadline,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          comments: task.comments || []
        })),
        catchError((error) => {
          console.error('Error assigning task note:', error);
          return throwError(() => new Error('Failed to assign task note'));
        })
      );
  }

  getCommentsByTaskId(taskId: number): Observable<TaskComment[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comment/task/${taskId}`, { headers: this.getHeaders() })
      .pipe(
        map(comments => comments.map(comment => ({
          id: comment.id,
          userId: comment.userId || '',
          userEmail: comment.userEmail,
          content: comment.content,
          createdAt: comment.createdAt
        }))),
        catchError((error) => {
          console.error(`Error fetching comments for task ${taskId}:`, error);
          return throwError(() => new Error('Failed to fetch comments'));
        })
      );
  }

  createComment(taskId: number, content: string): Observable<TaskComment> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    const body = { taskId, content };
    return this.http.post<any>(`${this.apiUrl}/comment/create`, body, { headers })
      .pipe(
        map(comment => ({
          id: comment.id,
          userId: comment.userId || '',
          userEmail: comment.userEmail,
          content: comment.content,
          createdAt: comment.createdAt
        })),
        catchError((error) => {
          console.error('Error creating comment:', error);
          let errorMessage = 'Failed to create comment';
          if (error.status === 403) {
            errorMessage = 'You are not authorized to comment on this task';
          } else if (error.status === 400) {
            errorMessage = 'Invalid comment data';
          } else if (error.status === 404) {
            errorMessage = 'Task not found';
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

}