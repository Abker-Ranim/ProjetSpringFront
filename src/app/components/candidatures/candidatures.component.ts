import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

interface Candidate {
  id: string;
  eventName: string;
  positionName: string;
  volunteerName: string;
  volunteerEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submissionDate: string;
  taskId: string;
}

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

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || 'GUEST';
    this.userEmail = localStorage.getItem('userEmail') || 'john.doe@example.com';
    this.dataService.getCandidates().subscribe((candidates) => {
      this.candidates = candidates;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  isResponsible(): boolean {
    return this.userRole === 'RESPONSIBLE';
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
            c.volunteerName.toLowerCase().includes(term) ||
            c.positionName.toLowerCase().includes(term) ||
            c.eventName.toLowerCase().includes(term)
        );
      }
    } else if (this.userRole === 'VOLUNTARY') {
      filtered = filtered.filter((c) => c.volunteerEmail === this.userEmail);
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
      this.router.navigate(['/admin/candidate-detail', candidateId]);
    }
  }

  acceptCandidate(candidate: Candidate): void {
    this.dataService.updateCandidateStatus(candidate.id, 'ACCEPTED');
    alert(`${candidate.volunteerName} accepted for ${candidate.positionName} at ${candidate.eventName}`);
  }

  rejectCandidate(candidate: Candidate): void {
    this.dataService.updateCandidateStatus(candidate.id, 'REJECTED');
    alert(`${candidate.volunteerName} rejected for ${candidate.positionName} at ${candidate.eventName}`);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  }
}