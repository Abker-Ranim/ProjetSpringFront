import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'toDo' | 'inProgress' | 'done';
  deadline?: string;
  assignedTo: string;
  assignedToName: string;
  createdBy: string;
  createdAt: string;
  teamId?: string;
  completedAt?: string;
  note?: number;
  comments: TaskComment[];
}

interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css'],
})
export class MyTasksComponent implements OnInit {
  myTasks: Task[] = [
    {
      id: '1',
      title: 'Créer une page d\'accueil',
      description: 'Concevoir et développer la page d\'accueil du site web de l\'événement.',
      status: 'toDo',
      deadline: '2025-06-15',
      assignedTo: 'user123',
      assignedToName: 'User Test',
      createdBy: 'admin',
      createdAt: '2025-05-01',
      teamId: '1',
      comments: [
        {
          id: '1',
          userId: 'admin',
          userName: 'Admin User',
          content: 'Comment avance le développement de la page d\'accueil?',
          createdAt: '2025-05-05T10:30:00',
        },
        
      ],
    },
    {
      id: '2',
      title: 'Créer les maquettes UI',
      description: 'Concevoir les maquettes UI pour l\'application mobile.',
      status: 'inProgress',
      deadline: '2025-05-20',
      assignedTo: 'user123',
      assignedToName: 'User Test',
      createdBy: 'admin',
      createdAt: '2025-05-01',
      comments: [
        {
          id: '1',
          userId: 'admin',
          userName: 'Admin User',
          content: 'As-tu commencé à travailler sur les maquettes?',
          createdAt: '2025-05-02T10:30:00',
        },
       
      ],
    },
    {
      id: '3',
      title: 'Intégrer l\'API de paiement',
      description: 'Intégrer l\'API Stripe pour le système de paiement des billets.',
      status: 'done',
      deadline: '2025-05-10',
      assignedTo: 'user123',
      assignedToName: 'User Test',
      createdBy: 'admin',
      createdAt: '2025-04-20',
      completedAt: '2025-05-08',
      note: 4,
      comments: [
        {
          id: '1',
          userId: 'admin',
          userName: 'Admin User',
          content: 'Cette tâche est prioritaire pour le lancement du site.',
          createdAt: '2025-04-20T10:30:00',
        },
        {
          id: '2',
          userId: 'user123',
          userName: 'User Test',
          content: 'J\'ai commencé l\'intégration. J\'ai quelques questions sur les clés API.',
          createdAt: '2025-04-22T11:45:00',
        },
       
 
      ],
    },
  ];

  commentForms: { [key: string]: FormGroup } = {};
  newComment: { [key: string]: string } = {};
  submitting = false;
  userRole = '';
  userName = 'User Test'; // Normalement récupéré depuis le service d'authentification
  userId = 'user123'; // Normalement récupéré depuis le service d'authentification

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Get user role from localStorage
    this.userRole = localStorage.getItem('userRole') || 'VOLUNTARY';

    // Initialize comment forms for each task
    this.myTasks.forEach((task) => {
      this.newComment[task.id] = '';
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'toDo':
        return 'À faire';
      case 'inProgress':
        return 'En cours';
      case 'done':
        return 'Terminée';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'toDo':
        return 'status-todo';
      case 'inProgress':
        return 'status-in-progress';
      case 'done':
        return 'status-completed';
      default:
        return '';
    }
  }

 

  changeTaskStatus(task: Task, newStatus: 'toDo' | 'inProgress' | 'done'): void {
    if (task.status === newStatus) return;

    this.submitting = true;

    // Simuler l'envoi au serveur
    setTimeout(() => {
      task.status = newStatus;

      // Si la tâche est marquée comme terminée, ajouter la date de complétion
      if (newStatus === 'done') {
        task.completedAt = new Date().toISOString();
      } else {
        // Si la tâche n'est plus terminée, supprimer la date de complétion et la note
        task.completedAt = undefined;
        task.note = undefined;
      }

      this.submitting = false;
      alert(`Statut de la tâche mis à jour: ${this.getStatusLabel(newStatus)}`);
    }, 1000);
  }

 rateTask(task: Task, note: number | undefined): void {
  if (task.status !== 'done') {
    alert('Vous ne pouvez noter que les tâches terminées.');
    return;
  }
  if (note == null || note < 0) {
    alert('Veuillez entrer une note valide (nombre positif).');
    return;
  }

  this.submitting = true;

  // Simuler l'envoi au serveur
  setTimeout(() => {
    task.note = note;
    this.submitting = false;
    alert(`Tâche évaluée avec la note de ${note}`);
  }, 1000);
}

  addComment(task: Task): void {
    if (!this.newComment[task.id].trim()) return;
    this.submitting = true;

    const comment: TaskComment = {
      id: Date.now().toString(),
      userId: this.userId,
      userName: this.userName,
      content: this.newComment[task.id],
      createdAt: new Date().toISOString(),
    };

    // Simuler l'envoi au serveur
    setTimeout(() => {
      task.comments.push(comment);
      this.newComment[task.id] = '';
      this.submitting = false;
    }, 1000);
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

  isVOLUNTARY(): boolean {
    return localStorage.getItem('userRole') === 'VOLUNTARY';
  }
  isResponsible(): boolean {
    return localStorage.getItem('userRole') === 'RESPONSIBLE';
  }
}