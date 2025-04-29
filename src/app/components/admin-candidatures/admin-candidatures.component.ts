import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Candidature {
  id: string;
  candidatNom: string;
  candidatEmail: string;
  evenementNom: string;
  poste: string;
  motivation: string;
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

  constructor() {}

  ngOnInit(): void {
    // Simuler le chargement des données depuis une API
    this.loadMockCandidatures();
    this.applyFilters();
  }

  loadMockCandidatures(): void {
    this.candidatures = [
      {
        id: '1',
        candidatNom: 'Ahmed Ben Ali',
        candidatEmail: 'ahmed.benali@email.com',
        evenementNom: 'Forum Entreprise',
        poste: 'Responsable logistique',
        motivation: 'Je suis très intéressé par cet événement car il me permettra de développer mes compétences en gestion logistique. J\'ai déjà participé à l\'organisation de plusieurs événements universitaires et je souhaite mettre mon expérience au service de ce forum.',
        datePostulation: new Date(2025, 2, 15),
        statut: 'en_attente'
      },
      {
        id: '2',
        candidatNom: 'Sarra Mansour',
        candidatEmail: 'sarra.mansour@email.com',
        evenementNom: 'Forum Entreprise',
        poste: 'Responsable communication',
        motivation: 'Étudiante en communication digitale, je souhaite mettre en pratique mes connaissances théoriques dans un contexte réel. Je maîtrise plusieurs outils de design graphique et de gestion des réseaux sociaux qui pourraient être utiles pour promouvoir l\'événement.',
        datePostulation: new Date(2025, 2, 14),
        statut: 'en_attente'
      },
      {
        id: '3',
        candidatNom: 'Mehdi Trabelsi',
        candidatEmail: 'mehdi.trabelsi@email.com',
        evenementNom: 'Enicarthage Robots',
        poste: 'Responsable technique',
        motivation: 'Passionné de robotique depuis mon plus jeune âge, j\'ai participé à plusieurs compétitions nationales. Je souhaite partager mon expertise et contribuer au succès de cet événement qui me tient particulièrement à cœur.',
        datePostulation: new Date(2025, 2, 10),
        statut: 'acceptee'
      },
      {
        id: '4',
        candidatNom: 'Nour Bouazizi',
        candidatEmail: 'nour.bouazizi@email.com',
        evenementNom: 'Enicarthage Robots',
        poste: 'Coordinateur des bénévoles',
        motivation: 'Ayant une expérience significative dans la gestion d\'équipe, je pense pouvoir apporter une contribution précieuse à l\'organisation de cet événement. Je suis organisée, rigoureuse et j\'ai un bon sens de la communication.',
        datePostulation: new Date(2025, 2, 8),
        statut: 'refusee'
      },
      {
        id: '5',
        candidatNom: 'Yassine Khelifi',
        candidatEmail: 'yassine.khelifi@email.com',
        evenementNom: 'Forum Entreprise',
        poste: 'Responsable accueil',
        motivation: 'Je suis dynamique, souriant et j\'aime le contact humain. Je parle couramment français, anglais et arabe, ce qui pourrait être un atout pour accueillir les participants internationaux. Je souhaite vivement rejoindre votre équipe pour cette expérience enrichissante.',
        datePostulation: new Date(2025, 2, 5),
        statut: 'en_attente'
      },
      {
        id: '6',
        candidatNom: 'Amina Riahi',
        candidatEmail: 'amina.riahi@email.com',
        evenementNom: 'Hackathon innovation',
        poste: 'Photographe/Vidéaste',
        motivation: 'Passionnée de photographie, je documente régulièrement les événements universitaires. J\'ai un équipement professionnel et les compétences nécessaires pour capturer les moments forts de cet événement et créer un contenu visuel attrayant pour vos futures communications.',
        datePostulation: new Date(2025, 2, 3),
        statut: 'en_attente'
      },
      {
        id: '7',
        candidatNom: 'Karim Nasri',
        candidatEmail: 'karim.nasri@email.com',
        evenementNom: 'Hackathon innovation',
        poste: 'Responsable technique',
        motivation: 'Étudiant en dernière année d\'ingénierie informatique, je souhaite mettre mes compétences techniques au service de cet événement. J\'ai une bonne maîtrise des langages de programmation et des outils nécessaires pour assurer le bon déroulement technique du hackathon.',
        datePostulation: new Date(2025, 1, 28),
        statut: 'acceptee'
      }
    ];
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
    
    // Simuler un délai de traitement
    setTimeout(() => {
      const index = this.candidatures.findIndex(c => c.id === id);
      if (index !== -1) {
        this.candidatures[index].statut = 'acceptee';
        
        // Dans une application réelle, vous enverriez un email ici
        console.log(`Email envoyé à ${this.candidatures[index].candidatEmail} pour l'informer que sa candidature a été acceptée.`);
      }
      
      this.processingIds.delete(id);
      this.applyFilters();
    }, 1000);
  }

  refuserCandidature(id: string): void {
    this.processingIds.add(id);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      const index = this.candidatures.findIndex(c => c.id === id);
      if (index !== -1) {
        this.candidatures[index].statut = 'refusee';
        
        // Dans une application réelle, vous enverriez un email ici
        console.log(`Email envoyé à ${this.candidatures[index].candidatEmail} pour l'informer que sa candidature a été refusée.`);
      }
      
      this.processingIds.delete(id);
      this.applyFilters();
    }, 1000);
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
