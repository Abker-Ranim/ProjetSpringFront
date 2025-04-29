import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: any = {
    id: '1',
    title: 'Tech Conference 2025',
    imageUrl: 'https://example.com/event-image.jpg',
    date: '2025-06-15',
  };
  currentTab: string = 'detail';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.firstChild?.url.subscribe((url) => {
      this.currentTab = url[0]?.path || 'detail';
    });
  }


  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  isVOLUNTARY(): boolean {
    return localStorage.getItem('userRole') === 'VOLUNTARY';
  }

  onEditEvent(): void {
    alert('Edit event functionality not implemented');
    
  }
  
  toggleInterest(): void {
    if (this.event) {
      this.event.isInterested = !this.event.isInterested;
      // Simulate server update (optional alert for feedback)
      setTimeout(() => {
        alert(this.event?.isInterested ? 'Vous êtes intéressé par cet événement !' : 'Vous avez retiré votre intérêt.');
      }, 500);
    }
  }
}