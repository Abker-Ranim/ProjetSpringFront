import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Candidate {
  id: string;
  eventName: string;
  positionName: string;
  volunteerName: string;
  volunteerEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submissionDate: string;
  taskId: string; // Link to task
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'toDo' | 'inProgress' | 'done';
  deadline?: string;
  createdBy: string;
  createdAt: string;
  teamId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private candidatesSubject = new BehaviorSubject<Candidate[]>([
    // Initial static data for testing
    {
      id: '1',
      eventName: 'Tech Conference 2025',
      positionName: 'Registration Assistant',
      volunteerName: 'John Doe',
      volunteerEmail: 'john.doe@example.com',
      status: 'PENDING',
      submissionDate: '2025-04-20',
      taskId: '1',
    },
  ]);

  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      id: '1',
      title: 'Create Homepage',
      description: 'Design and develop the event website homepage.',
      status: 'toDo',
      deadline: '2025-06-15',
      createdBy: 'admin',
      createdAt: '2025-05-01',
      teamId: '1',
    },
    {
      id: '2',
      title: 'Integrate Payment System',
      description: 'Integrate Stripe for event ticket payments.',
      status: 'inProgress',
      deadline: '2025-06-30',
      createdBy: 'admin',
      createdAt: '2025-05-02',
      teamId: '2',
    },
  ]);

  private teams = [
    { id: '1', name: 'Web Team', eventName: 'Tech Conference 2025' },
    { id: '2', name: 'Technical Team', eventName: 'Tech Conference 2025' },
  ];

  getCandidates(): Observable<Candidate[]> {
    return this.candidatesSubject.asObservable();
  }

  addCandidate(candidate: Candidate): void {
    const currentCandidates = this.candidatesSubject.getValue();
    this.candidatesSubject.next([...currentCandidates, candidate]);
  }

  updateCandidateStatus(candidateId: string, status: 'ACCEPTED' | 'REJECTED'): void {
    const currentCandidates = this.candidatesSubject.getValue();
    const updatedCandidates = currentCandidates.map((c) =>
      c.id === candidateId ? { ...c, status } : c
    );
    this.candidatesSubject.next(updatedCandidates);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    this.tasksSubject.next([...currentTasks, task]);
  }

  getTeamEventName(teamId: string | undefined): string {
    return this.teams.find((t) => t.id === teamId)?.eventName || 'General Event';
  }

  getTeamName(teamId: string | undefined): string {
    return this.teams.find((t) => t.id === teamId)?.name || 'No Team';
  }
}