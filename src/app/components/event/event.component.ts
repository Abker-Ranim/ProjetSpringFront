import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventService, Event } from '../../services/event-service.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  currentUser: any;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  currentFilter = 'all';
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  showAddEventModal = false;
  searchTerm: string = '';
  eventForm: FormGroup;
  submitting = false;
  imageFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      organization: ['', Validators.required],
      vision: ['', Validators.required],
      participants: ['', [Validators.required, Validators.min(1)]],
      imageFile: [null]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        console.log('Events loaded:', events);
        this.events = events.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: event.createdAt ? new Date(event.createdAt) : new Date()
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.events];

    if (this.currentFilter === 'upcoming') {
      filtered = filtered.filter((event) => this.isUpcoming(event));
    } else if (this.currentFilter === 'past') {
      filtered = filtered.filter((event) => !this.isUpcoming(event));
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredEvents = filtered.slice(startIndex, endIndex);
  }

  filterEvents(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  isUpcoming(event: Event): boolean {
    return new Date(event.startDate) > new Date();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewEventDetails(event: Event): void {
    const role = this.authService.getRole()?.toLowerCase() || 'user';
    const route = `${role}/events`;
    this.router.navigate([route, event.id, 'detail']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  canAddEvent(): boolean {
    return this.isAdmin();
  }

  openAddEventModal(): void {
    this.eventForm.reset();
    this.imageFile = null;
    this.showAddEventModal = true;
  }

  closeAddEventModal(): void {
    this.showAddEventModal = false;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB max
      this.imageFile = file;
    } else {
      alert('L\'image doit être inférieure à 5MB.');
    }
  }

  submitEventForm(): void {
    if (this.eventForm.invalid) return;

    this.submitting = true;

    const newEvent: Event = {
      id: 0,
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      location: this.eventForm.value.location,
      startDate: new Date(this.eventForm.value.startDate),
      endDate: new Date(this.eventForm.value.endDate),
      createdAt: new Date(),
      organization: this.eventForm.value.organization,
      vision: this.eventForm.value.vision,
      participants: Number(this.eventForm.value.participants),
      imagePath: undefined // Pas nécessaire ici, géré par l'API
    };

    this.eventService.createEvent(newEvent, this.imageFile || undefined).subscribe({
      next: (event) => {
        console.log('Event created:', event);
        this.loadEvents();
        this.submitting = false;
        this.closeAddEventModal();
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert('Erreur lors de la création de l\'événement.');
        this.submitting = false;
      }
    });
  }

  deleteEvent(event: Event): void {
    if (confirm(`Voulez-vous vraiment supprimer l'événement "${event.title}" ?`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== event.id);
          this.applyFilters();
          console.log(`Événement "${event.title}" supprimé avec succès.`);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'événement:', err);
          alert('Erreur lors de la suppression de l\'événement.');
        }
      });
    }
  }
}