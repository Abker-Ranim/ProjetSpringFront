import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService, Task, TaskComment } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css'],
})
export class MyTasksComponent implements OnInit {
  myTasks: Task[] = [];
  newComment: { [key: string]: string } = {};
  submitting = false;
  userRole = '';
  userName = '';
  userId = '';

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userName = localStorage.getItem('userName') || 'User';
    this.userId = localStorage.getItem('userId') || '';
    console.log('User context:', { userId: this.userId, userRole: this.userRole, userName: this.userName });

    this.loadTasks();
  }

  loadTasks(): void {
    const loadMethod = this.isVolunteer() ? this.taskService.getTasksByVolunteer() : this.taskService.getTasksByResponsible();
    
    loadMethod.subscribe({
      next: (tasks) => {
        console.log('Tasks loaded:', tasks);
        this.myTasks = tasks;
        this.myTasks.forEach((task) => {
          this.newComment[task.id] = '';
          // Fetch comments for each task
          this.taskService.getCommentsByTaskId(task.id).subscribe({
            next: (comments) => {
              task.comments = comments;
            },
            error: (err) => {
              console.error(`Error loading comments for task ${task.id}:`, err);
              task.comments = [];
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        alert('Failed to load tasks');
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ToDo':
        return 'À faire';
      case 'InProgress':
        return 'En cours';
      case 'Done':
        return 'Terminée';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ToDo':
        return 'status-todo';
      case 'InProgress':
        return 'status-in-progress';
      case 'Done':
        return 'status-completed';
      default:
        return '';
    }
  }

  changeTaskStatus(task: Task, newStatus: 'ToDo' | 'InProgress' | 'Done'): void {
    if (task.status === newStatus) return;

    console.log(`Attempting to change status of task ${task.id} from ${task.status} to ${newStatus} for user ${this.userId}`);
    this.submitting = true;

    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: (updatedTask) => {
        console.log(`Successfully updated task ${task.id} status to ${updatedTask.status}`);
        task.status = updatedTask.status;
        task.completedAt = updatedTask.status === 'Done' ? new Date().toISOString() : undefined;
        if (task.status !== 'Done') {
          task.note = undefined;
        }
        this.submitting = false;
        alert(`Statut de la tâche mis à jour: ${this.getStatusLabel(newStatus)}`);
      },
      error: (err) => {
        console.error(`Failed to update task ${task.id} status:`, err);
        this.submitting = false;
        alert('Erreur lors de la mise à jour du statut: ' + (err.message || 'Veuillez réessayer'));
      }
    });
  }

  rateTask(task: Task, note: number | undefined): void {
    if (task.status !== 'Done') {
      alert('Vous ne pouvez noter que les tâches terminées.');
      return;
    }
    if (note == null || note < 0 || note > 100) {
      alert('Veuillez entrer une note valide (entre 0 et 100).');
      return;
    }

    this.submitting = true;
    this.taskService.assignTaskNote(task.id, note).subscribe({
      next: (updatedTask) => {
        task.note = updatedTask.note;
        this.submitting = false;
        alert(`Tâche évaluée avec la note de ${note}`);
      },
      error: (err) => {
        this.submitting = false;
        alert('Erreur lors de l\'assignation de la note: ' + (err.message || 'Veuillez réessayer'));
      }
    });
  }

  addComment(task: Task): void {
    if (!this.newComment[task.id].trim()) return;
    this.submitting = true;

    this.taskService.createComment(task.id, this.newComment[task.id]).subscribe({
      next: (comment) => {
        task.comments.push(comment);
        this.newComment[task.id] = '';
        this.submitting = false;
        alert('Commentaire ajouté avec succès');
      },
      error: (err) => {
        console.error(`Error adding comment to task ${task.id}:`, err);
        this.submitting = false;
        alert('Erreur lors de l\'ajout du commentaire: ' + (err.message || 'Veuillez réessayer'));
      }
    });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} secondes`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} heures`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} jours`;
    }
  }

  isVolunteer(): boolean {
    return this.userRole === 'VOLUNTARY';
  }

  isResponsible(): boolean {
    return this.userRole === 'RESPONSIBLE';
  }
}