import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task, Team } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  teams: Team[] = [];
  displayedTasks: Task[] = [];
  tasksPerPage = 5;
  currentTaskIndex = 0;
  showAddTaskForm = false;
  showApplyForm = false;
  selectedTask: Task | null = null;
  addTaskForm: FormGroup;
  applyForm: FormGroup;
  selectedFile: File | null = null;
  submitting = false;
  userRole = '';
  userEmail = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.addTaskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      teamId: [''],
      eventId: ['']
    });

    this.applyForm = this.formBuilder.group({
      motivation: ['', Validators.required],
      experience: ['', Validators.required],
      cv: ['']
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();
    this.loadTeams();
  }

  loadTasks(): void {
    const loadMethod = this.isResponsible()
      ? this.taskService.getTasksByResponsible()
      : this.taskService.getAllTasks();

    loadMethod.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.updateDisplayedTasks();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        alert('Failed to load tasks');
      }
    });
  }

  loadTeams(): void {
    this.taskService.getAllTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.teams = [];
      }
    });
  }

  updateDisplayedTasks(): void {
    const start = this.currentTaskIndex * this.tasksPerPage;
    const end = start + this.tasksPerPage;
    this.displayedTasks = this.tasks.slice(start, end);
  }

  prevTasks(): void {
    if (this.currentTaskIndex > 0) {
      this.currentTaskIndex--;
      this.updateDisplayedTasks();
    }
  }

  nextTasks(): void {
    if ((this.currentTaskIndex + 1) * this.tasksPerPage < this.tasks.length) {
      this.currentTaskIndex++;
      this.updateDisplayedTasks();
    }
  }

  canApply(): boolean {
    return this.userRole === 'USER' || this.userRole === 'VOLUNTARY';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isResponsible(): boolean {
    return this.userRole === 'RESPONSIBLE';
  }

 

  openApplyForm(task: Task): void {
    this.selectedTask = task;
    this.showApplyForm = true;
  }

  closeApplyForm(): void {
    this.showApplyForm = false;
    this.selectedTask = null;
    this.selectedFile = null;
    this.applyForm.reset();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  submitApplication(): void {
    if (this.applyForm.invalid || !this.selectedTask) return;
    this.submitting = true;

    const description = `${this.applyForm.value.motivation}\n\nExperience:\n${this.applyForm.value.experience}`;
    this.taskService.applyForVolunteer(this.selectedTask.id, description, this.selectedFile).subscribe({
      next: (response) => {
        alert('Application submitted successfully! Waiting for review.');
        this.submitting = false;
        this.closeApplyForm();
      },
      error: (err) => {
        alert(err.message || 'Error submitting application');
        this.submitting = false;
      }
    });
  }

  openAddTaskForm(): void {
    this.showAddTaskForm = true;
  }

  closeAddTaskForm(): void {
    this.showAddTaskForm = false;
    this.addTaskForm.reset();
  }

  submitTask(): void {
    if (this.addTaskForm.invalid) return;
    this.submitting = true;

    const taskData = {
      title: this.addTaskForm.value.title,
      description: this.addTaskForm.value.description,
      teamId: this.addTaskForm.value.teamId ? Number(this.addTaskForm.value.teamId) : null,
      eventId: this.addTaskForm.value.eventId ? Number(this.addTaskForm.value.eventId) : null,
      status: 'ToDo'
    };

    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        this.tasks.push(response);
        this.updateDisplayedTasks();
        this.submitting = false;
        this.closeAddTaskForm();
        alert('Task created successfully!');
      },
      error: (err) => {
        alert('Error creating task: ' + (err.message || 'Please try again'));
        this.submitting = false;
      }
    });
  }

  getTeamName(teamId: number | undefined): string {
    return this.teams.find((t) => t.id === teamId)?.name || 'No team';
  }
}