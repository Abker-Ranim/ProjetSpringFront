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
import { DataService } from '../../services/data.service';

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

interface Team {
  id: string;
  name: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  teams: Team[] = [
    { id: '1', name: 'Web Team' },
    { id: '2', name: 'Technical Team' },
  ];
  displayedTasks: Task[] = [];
  tasksPerPage = 5;
  currentTaskIndex = 0;
  showAddTaskForm = false;
  showApplyForm = false;
  selectedTask: Task | null = null;
  addTaskForm: FormGroup;
  applyForm: FormGroup;
  submitting = false;
  userRole = '';
  userName = 'User Test';
  userId = 'user123';
  userEmail = 'john.doe@example.com'; // Mocked, replace with auth service
  selectedFile: File | null = null;
  fileUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    this.addTaskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      deadline: [''],
      teamId: [''],
    });

    this.applyForm = this.formBuilder.group({
      motivation: ['', Validators.required],
      experience: ['', Validators.required],
      cv: [''],
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || 'VOLUNTARY';
    this.userEmail =
      localStorage.getItem('userEmail') || 'john.doe@example.com';
    this.dataService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.updateDisplayedTasks();
    });
    this.route.queryParams.subscribe((params) => {
      this.showAddTaskForm = params['addTask'] === 'true';
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
    return this.userRole === 'VOLUNTARY';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isResponsible(): boolean {
    return this.userRole === 'RESPONSIBLE';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'toDo':
        return 'To Do';
      case 'inProgress':
        return 'In Progress';
      case 'done':
        return 'Done';
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

  openApplyForm(task: Task): void {
    this.selectedTask = task;
    this.showApplyForm = true;
  }

  closeApplyForm(): void {
    this.showApplyForm = false;
    this.selectedTask = null;
    this.applyForm.reset();
    this.selectedFile = null;
    this.fileUrl = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
      this.fileUrl = null;
    }
  }

  submitApplication(): void {
    if (this.applyForm.invalid || !this.selectedTask) return;
    this.submitting = true;

    const candidature = {
      id: Date.now().toString(),
      eventName: this.dataService.getTeamEventName(this.selectedTask.teamId),
      positionName: this.selectedTask.title,
      volunteerName: this.userName,
      volunteerEmail: this.userEmail,
      status: 'PENDING' as 'PENDING',
      submissionDate: new Date().toISOString().split('T')[0],
      taskId: this.selectedTask.id,
    };

    this.dataService.addCandidate(candidature);
    setTimeout(() => {
      alert('Your application has been submitted successfully!');
      this.submitting = false;
      this.closeApplyForm();
    }, 1000);
  }

  openAddTaskForm(): void {
    this.showAddTaskForm = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTask: 'true' },
      queryParamsHandling: 'merge',
    });
  }

  closeAddTaskForm(): void {
    this.showAddTaskForm = false;
    this.addTaskForm.reset();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTask: null },
      queryParamsHandling: 'merge',
    });
  }

  submitTask(): void {
    if (this.addTaskForm.invalid) return;
    this.submitting = true;

    const taskData: Task = {
      id: Date.now().toString(),
      title: this.addTaskForm.value.title,
      description: this.addTaskForm.value.description,
      status: 'toDo',
      deadline: this.addTaskForm.value.deadline,
      teamId: this.addTaskForm.value.teamId || undefined,
      createdBy: this.userId,
      createdAt: new Date().toISOString(),
    };

    this.dataService.addTask(taskData);
    setTimeout(() => {
      this.submitting = false;
      this.closeAddTaskForm();
      alert('Task added successfully!');
    }, 1000);
  }

  getTeamName(teamId: string | undefined): string {
    return this.dataService.getTeamName(teamId);
  }
}
