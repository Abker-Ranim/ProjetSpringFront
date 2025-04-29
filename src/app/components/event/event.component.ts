import { Component } from '@angular/core';
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
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;

}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  currentUser: any;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  currentFilter = 'all';

  // Pagination
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;

  // Modals
  showAddEventModal = false;

  // Search term
  searchTerm: string = '';

  // Forms
  eventForm: FormGroup;
  submitting = false;

  // Selected event for assigning responsible
  selectedEvent: Event | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router,    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      imageUrl: [''],
      
    });

  }

  ngOnInit(): void {
    // Simuler un chargement
    setTimeout(() => {
      this.loadMockEvents();
      this.loading = false;
    }, 1000);
  }

  loadMockEvents(): void {
    this.events = [
      {
        id: '1',
        title: "Form d'entreprise",
        description: "Formation sur la création d'entreprise",
        location: 'UTICA',
        startDate: new Date(2023, 5, 15, 9, 0),
        endDate: new Date(2023, 5, 15, 17, 0),
        createdAt: new Date(2023, 5, 1),
      },
      {
        id: '2',
        title: 'Stages et PFE',
        description: "Journée d'information sur les stages et PFE",
        location: 'UTICA',
        startDate: new Date(2023, 6, 20, 10, 0),
        endDate: new Date(2023, 6, 20, 16, 0),
        createdAt: new Date(2023, 6, 5),
      },
      {
        id: '3',
        title: 'Journée de recrutement',
        description: 'Rencontre avec les entreprises qui recrutent',
        location: 'Centre de conférences',
        startDate: new Date(2023, 7, 10, 9, 0),
        endDate: new Date(2023, 7, 10, 18, 0),
        createdAt: new Date(2023, 7, 1),
      },
      {
        id: '4',
        title: 'Atelier de développement web',
        description: 'Apprendre les bases du développement web',
        location: 'Salle de formation',
        startDate: new Date(2025, 3, 5, 9, 0),
        endDate: new Date(2025, 3, 5, 17, 0),
        createdAt: new Date(2023, 2, 15),
      },
      {
        id: '5',
        title: "Conférence sur l'IA",
        description: 'Les dernières avancées en intelligence artificielle',
        location: 'Centre de conférences',
        startDate: new Date(2025, 4, 12, 10, 0),
        endDate: new Date(2025, 4, 12, 16, 0),
        createdAt: new Date(2023, 3, 20),
      
      },
      {
        id: '6',
        title: 'Hackathon innovation',
        description: '48h pour développer un projet innovant',
        location: 'UTICA',
        startDate: new Date(2025, 5, 15, 9, 0),
        endDate: new Date(2025, 5, 17, 18, 0),
        createdAt: new Date(2023, 4, 10),
      },
    ];

    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.events];

    // Apply status filter
    if (this.currentFilter === 'upcoming') {
      filtered = filtered.filter((event) => this.isUpcoming(event));
    } else if (this.currentFilter === 'past') {
      filtered = filtered.filter((event) => !this.isUpcoming(event));
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate total pages
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // Apply pagination
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
    const route = this.isAdmin() ? 'admin/events' : 'voluntary/events';
    this.router.navigate([route, event.id]);
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  canAddEvent(): boolean {
    return this.isAdmin();
  }

 
  // Modal d'ajout d'événement
  openAddEventModal(): void {
    this.eventForm.reset();
    this.showAddEventModal = true;
  }

  closeAddEventModal(): void {
    this.showAddEventModal = false;
  }

  submitEventForm(): void {
    if (this.eventForm.invalid) return;

    this.submitting = true;

    // Simuler un délai de traitement
    setTimeout(() => {
      const newEvent: Event = {
        id: (this.events.length + 1).toString(),
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        location: this.eventForm.value.location,
        startDate: new Date(this.eventForm.value.startDate),
        endDate: new Date(this.eventForm.value.endDate),
        createdAt: new Date(),
      };

      this.events.unshift(newEvent);
      this.submitting = false;
      this.closeAddEventModal();
      this.applyFilters();
    }, 1500);
  }

  

}
