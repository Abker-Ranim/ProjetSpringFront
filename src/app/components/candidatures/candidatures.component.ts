import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CandidatureService, Candidate } from '../../services/candidature.service';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './candidatures.component.html',
  styleUrls: ['./candidatures.component.css'],
})
export class CandidaturesComponent implements OnInit {
  userRole: string | null = '';
  userEmail: string | null = '';
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  currentFilter = 'all';
  searchTerm = '';
  isLoading = true;
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  comments: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || 'GUEST';
    this.userEmail = localStorage.getItem('userEmail') || 'unknown@example.com';
    this.loadCandidatures();
  }

  isResponsible(): boolean {
    return this.userRole === 'RESPONSIBLE';
  }

 

  loadCandidatures(): void {
    this.isLoading = true;
    const observable = this.isResponsible()
      ? this.candidatureService.getVolunteerCandidaturesForResponsible()
      : this.candidatureService.getUserCandidatures();

    observable.subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidatures:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.candidates];

    if (this.isResponsible()) {
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter((c) => c.status === this.currentFilter);
      }
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.taskName.toLowerCase().includes(term) ||
            c.eventName.toLowerCase().includes(term) ||
            c.teamName.toLowerCase().includes(term) 
        );
      }
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCandidates = filtered.slice(startIndex, endIndex);
  }

  filterCandidatures(status: string): void {
    if (this.isResponsible()) {
      this.currentFilter = status;
      this.currentPage = 1;
      this.applyFilters();
    }
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

  goToCandidateDetail(candidateId: string): void {
    if (this.isResponsible()) {
      this.router.navigate(['/responsible/candidate-detail', candidateId]);
    }
  }


  acceptCandidate(candidate: Candidate): void {
    const comments = this.comments[candidate.id] || '';
    this.candidatureService.updateCandidateStatus(candidate.id, 'APPROVED', comments).subscribe({
      next: () => {
        alert(`${candidate.name} approved for ${candidate.taskName} at ${candidate.eventName} at ${candidate.teamName}`);
        this.loadCandidatures();
      },
      error: (error) => {
        console.error('Error approving candidate:', error);
        alert('Failed to approve candidate');
      },
    });
  }

  rejectCandidate(candidate: Candidate): void {
    const comments = this.comments[candidate.id] || '';
    this.candidatureService.updateCandidateStatus(candidate.id, 'REJECTED', comments).subscribe({
      next: () => {
        alert(`${candidate.name} rejected for ${candidate.taskName} at ${candidate.eventName} at ${candidate.teamName}`);
        this.loadCandidatures();
      },
      error: (error) => {
        console.error('Error rejecting candidate:', error);
        alert('Failed to reject candidate');
      },
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  }
}