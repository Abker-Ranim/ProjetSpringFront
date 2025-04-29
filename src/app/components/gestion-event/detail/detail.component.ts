
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventDetailComponent } from '../../event-detail/event-detail.component';
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  startHour: string;
  endHour: string;
  imageUrl?: string;
  organization?: string;
  participants  ?: string;
  vision?: string;
  postes?: Poste[];
}

interface Poste {
  id: string;
  title: string;
  type: string;
  description: string;
  competences?: string[];
  isOpen: boolean;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  event!: Event;
  currentUser = { role: 'ADMIN' }; // Mocked user
  displayedPostes: Poste[] = [];
  currentPosteIndex = 0;
  postesPerPage = 3;

  constructor(public parent: EventDetailComponent) {}

  ngOnInit(): void {
    this.currentUser = { role: 'ADMIN' }; // Adjust to 'VOLUNTARY' for testing
    if (!this.parent.event) {
      throw new Error('Event is not loaded in parent');
    }
    this.event = this.parent.event;
    if (this.event.postes) {
      this.displayedPostes = this.event.postes.slice(0, this.postesPerPage);
    }
  }

  isUpcoming(event: Event): boolean {
    if (!event.startDate) return false;
    return new Date(event.startDate) > new Date();
  }

 
}