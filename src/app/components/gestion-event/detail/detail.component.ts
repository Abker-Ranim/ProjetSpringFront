import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventDetailComponent } from '../../event-detail/event-detail.component';
import { AuthService } from '../../../services/auth.service';
import { Event } from '../../../services/event-service.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  event!: Event;
  startHour: string = '';
  endHour: string = '';
  currentUser: { role: string } | null = null;

  constructor(public parent: EventDetailComponent, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = { role: this.authService.getRole() || '' };

    if (!this.parent.event) {
      throw new Error('Event is not loaded in parent');
    }
    this.event = this.parent.event;
    this.startHour = this.formatHour(this.event.startDate);
    this.endHour = this.formatHour(this.event.endDate);
  }

  formatHour(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    // Normaliser les barres obliques
    const normalizedPath = imagePath.replace(/\\/g, '/');
    // Extraire uniquement le nom du fichier
    const fileName = normalizedPath.split('/').pop() || '';
    // Construire l'URL correcte pointant vers le backend
    const imageUrl = `http://localhost:8089/images/${fileName}`;
    console.log('Generated image URL:', imageUrl);
    return imageUrl;
  }

  onImageError(errorEvent: ErrorEvent): void {
    const target = errorEvent.target as HTMLImageElement;
    console.error('Failed to load image:', target.src);
    target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  }

  isUpcoming(event: Event): boolean {
    if (!event.startDate) return false;
    return new Date(event.startDate) > new Date();
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Découvrez cet événement : ${this.event.title}`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(this.event.title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}