import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Candidate {
  id: string;
  name: string;
  email: string;
  motivation: string;
  experience: string;
  cvUrl: string;
  eventName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

@Component({
  selector: 'app-candidate-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css'],
})
export class CandidateDetailComponent implements OnInit {
  candidateId: string | null = null;
  candidateDetails: Candidate | null = null;
  isLoading = true;

  // Données statiques pour les détails des candidats
  private candidates: Candidate[] = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      motivation: 'Je suis motivé pour organiser cet événement et apporter mes compétences en logistique.',
      experience: '5 ans en gestion d’événements',
      cvUrl: 'https://example.com/jean-dupont-cv.pdf',
      eventName: 'Tech Conference 2025',
      status: 'PENDING',
    },
    {
      id: '2',
      name: 'Marie Curie',
      email: 'marie.curie@example.com',
      motivation: 'Passionnée par la communication, je veux promouvoir cet événement.',
      experience: '3 ans en communication événementielle',
      cvUrl: 'https://example.com/marie-curie-cv.pdf',
      eventName: 'Charity Run',
      status: 'ACCEPTED',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('CandidateDetailComponent initialized'); // Debug
    this.candidateId = this.route.snapshot.paramMap.get('id');
    console.log('Candidate ID received:', this.candidateId); // Debug
    if (this.candidateId) {
      setTimeout(() => {
        this.candidateDetails = this.candidates.find((c) => c.id === this.candidateId) || null;
        console.log('Candidate Details:', this.candidateDetails); // Debug
        if (!this.candidateDetails) {
          console.warn(`No candidate found for ID: ${this.candidateId}`);
        }
        this.isLoading = false;
      }, 1000);
    } else {
      console.error('No candidate ID provided');
      this.isLoading = false;
    }
  }

  updateStatus(status: 'ACCEPTED' | 'REJECTED'): void {
    if (this.candidateDetails) {
      this.candidateDetails.status = status;
      alert(`Candidature ${status === 'ACCEPTED' ? 'acceptée' : 'rejetée'} avec succès !`);
    }
  }
}