import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleRequestDTO, RoleRequestService } from '../../services/role-request.service';

interface Candidature {
  id: string;
  candidatNom: string;
  candidatEmail: string;
  evenementNom: string;
  poste: string;
  motivation: string;
  experience: string;
  datePostulation: Date;
  cv?: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

@Component({
  selector: 'app-admin-candidatures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-candidatures.component.html',
  styleUrls: ['./admin-candidatures.component.css']
})
export class AdminCandidaturesComponent implements OnInit {
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  searchTerm: string = '';
  filterStatut: 'tous' | 'en_attente' | 'acceptee' | 'refusee' = 'tous';
  
  // Pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  // Pour le modal de détails
  selectedCandidature: Candidature | null = null;
  showDetailsModal: boolean = false;
  
  // Pour les actions en cours
  processingIds: Set<string> = new Set();

  constructor(private roleRequestService: RoleRequestService) {}

  ngOnInit(): void {
    this.loadCandidatures();
    this.applyFilters();
  }

  loadCandidatures(): void {
    this.roleRequestService.getAllTeamResponsibleRequests().subscribe({
      next: (data: RoleRequestDTO[]) => {
        this.candidatures = data.map(dto => this.mapToCandidature(dto));
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching candidatures:', error);
        // Handle error (e.g., show error message to user)
      }
    });
  }

  private mapToCandidature(dto: RoleRequestDTO): Candidature {
    return {
      id: dto.id.toString(),
      candidatNom: dto.userName || 'N/A',
      candidatEmail: dto.userEmail || 'N/A',
      evenementNom: dto.eventTitle || 'N/A',
      poste: dto.teamName || 'Responsable d\'équipe',
      motivation: dto.description || 'Aucune motivation fournie',
      experience: dto.experience || 'Aucune expérience fournie',
      datePostulation: dto.submittedAt ? new Date(dto.submittedAt) : new Date(),
      cv: dto.cvPath || undefined,
      statut: this.mapStatus(dto.status)
    };
  }

  private mapStatus(status: string): 'en_attente' | 'acceptee' | 'refusee' {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'en_attente';
      case 'APPROVED': return 'acceptee';
      case 'REJECTED': return 'refusee';
      default: return 'en_attente';
    }
  }

  applyFilters(): void {
    let filtered = [...this.candidatures];
    
    // Appliquer le filtre de statut
    if (this.filterStatut !== 'tous') {
      filtered = filtered.filter(c => c.statut === this.filterStatut);
    }
    
    // Appliquer la recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.candidatNom.toLowerCase().includes(term) ||
        c.candidatEmail.toLowerCase().includes(term) ||
        c.evenementNom.toLowerCase().includes(term) ||
        c.poste.toLowerCase().includes(term)
      );
    }
    
    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => b.datePostulation.getTime() - a.datePostulation.getTime());
    
    // Calculer le nombre total de pages
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    // Appliquer la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCandidatures = filtered.slice(startIndex, endIndex);
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

  openDetailsModal(candidature: Candidature): void {
    this.selectedCandidature = candidature;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedCandidature = null;
  }

  accepterCandidature(id: string): void {
    this.processingIds.add(id);
    const requestId = Number(id);
    
    this.roleRequestService.reviewResponsibleRequest(requestId, 'APPROVED').subscribe({
      next: (updatedRequest: RoleRequestDTO) => {
        const index = this.candidatures.findIndex(c => c.id === id);
        if (index !== -1) {
          this.candidatures[index] = this.mapToCandidature(updatedRequest);
          console.log(`Email envoyé à ${this.candidatures[index].candidatEmail} pour l'informer que sa candidature a été acceptée.`);
        }
        this.processingIds.delete(id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error accepting candidature:', error);
        this.processingIds.delete(id);
        // Handle error (e.g., show error message to user)
      }
    });
  }

  refuserCandidature(id: string): void {
    this.processingIds.add(id);
    const requestId = Number(id);
    
    this.roleRequestService.reviewResponsibleRequest(requestId, 'REJECTED').subscribe({
      next: (updatedRequest: RoleRequestDTO) => {
        const index = this.candidatures.findIndex(c => c.id === id);
        if (index !== -1) {
          this.candidatures[index] = this.mapToCandidature(updatedRequest);
          console.log(`Email envoyé à ${this.candidatures[index].candidatEmail} pour l'informer que sa candidature a été refusée.`);
        }
        this.processingIds.delete(id);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error rejecting candidature:', error);
        this.processingIds.delete(id);
        // Handle error (e.g., show error message to user)
      }
    });
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      default: return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'statut-attente';
      case 'acceptee': return 'statut-acceptee';
      case 'refusee': return 'statut-refusee';
      default: return '';
    }
  }
}