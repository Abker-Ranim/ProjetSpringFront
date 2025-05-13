import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService, Candidate } from '../../../services/candidature.service';

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

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    console.log('CandidateDetailComponent initialized');
    this.candidateId = this.route.snapshot.paramMap.get('id');
    console.log('Candidate ID received:', this.candidateId);

    if (this.candidateId) {
      this.candidatureService.getCandidateById(this.candidateId).subscribe({
        next: (candidate) => {
          this.candidateDetails = candidate;
          console.log('Candidate Details:', this.candidateDetails);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching candidate details:', error);
          this.isLoading = false;
        },
      });
    } else {
      console.error('No candidate ID provided');
      this.isLoading = false;
    }
  }

  updateStatus(status: 'APPROVED' | 'REJECTED'): void {
    if (this.candidateDetails && this.candidateId) {
      this.candidatureService.updateCandidateStatus(this.candidateId, status).subscribe({
        next: () => {
          this.candidateDetails!.status = status;
          alert(`Candidature ${status === 'APPROVED' ? 'acceptée' : 'rejetée'} avec succès !`);
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Échec de la mise à jour du statut');
        },
      });
    }
  }
}