import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event-service.service';
import { Event } from '../../services/event-service.service';
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  currentTab: string = 'detail';
  isInterested: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(+eventId);
    }

    this.route.firstChild?.url.subscribe((url) => {
      this.currentTab = url[0]?.path || 'detail';
    });
  }

  loadEvent(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = {
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: new Date(event.createdAt)
        };
        console.log('Event loaded:', this.event);
        console.log('Image path:', this.event.imagePath);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.event = null;
      }
    });
  }



  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  isVOLUNTARY(): boolean {
    return localStorage.getItem('userRole') === 'VOLUNTARY';
  }

  onEditEvent(): void {
    if (this.event) {
      this.router.navigate(['admin/events', this.event.id, 'edit']);
    }
  }

  toggleInterest(): void {
    this.isInterested = !this.isInterested;
    setTimeout(() => {
      alert(this.isInterested ? 'Vous êtes intéressé par cet événement !' : 'Vous avez retiré votre intérêt.');
    }, 500);
  }
}
