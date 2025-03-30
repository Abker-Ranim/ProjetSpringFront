import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

interface ResponsiblePerson {
  id: string;
  email: string;
  description?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  createdAt: Date;
  responsiblePerson?: ResponsiblePerson;
  organization?: string;
  participants?: number;
  technology?: string;
}

interface Poste {
  id: string;
  title: string;
  type: string;
  description: string;
  competences: string[];
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  currentUser: any;
  event: Event | null = null;
  postes: Poste[] = [];
  displayedPostes: Poste[] = [];
  currentPosteIndex = 0;
  postesPerPage = 3;

  // Modal pour postuler
  showApplyModal = false;
  selectedPoste: Poste | null = null;
  applyForm: FormGroup;
  submitting = false;
  fileName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private location: Location
  ) {
    this.applyForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      motivation: ['', Validators.required],
      experience: [''],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Dans une application réelle, vous feriez un appel API ici
      this.loadMockEvent(id);
      this.loadMockPostes();
      this.updateDisplayedPostes();
    } else {
      this.router.navigate(['/events']);
    }
  }
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isVOLUNTARY(): boolean {
    return this.currentUser?.role === 'VOLUNTARY';
  }

  canApply(): boolean {
    return this.isVOLUNTARY();
  }

  canAssignResponsible(): boolean {
    return this.isAdmin();
  }

  canAddEvent(): boolean {
    return this.isAdmin();
  }
  loadMockEvent(id: string): void {
    // Simuler le chargement d'un événement
    const mockEvents: Event[] = [
      {
        id: '1',
        title: "Form d'entreprise",
        description:
          "Formation sur la création d'entreprise. Cet événement vise à fournir aux participants les connaissances et les outils nécessaires pour créer et développer leur propre entreprise. Des experts du domaine partageront leurs expériences et conseils pratiques.",
        location: 'UTICA',
        startDate: new Date(2023, 5, 15, 9, 0),
        endDate: new Date(2023, 5, 15, 17, 0),
        createdAt: new Date(2023, 5, 1),
        organization: 'UTICA',
        participants: 120,
        technology: 'Entrepreneuriat',
      },
      {
        id: '2',
        title: 'Stages et PFE',
        description:
          "Journée d'information sur les stages et PFE. Cette journée est dédiée à la présentation des opportunités de stages et de projets de fin d'études disponibles dans différentes entreprises partenaires. Les étudiants pourront échanger directement avec les représentants des entreprises.",
        location: 'UTICA',
        startDate: new Date(2023, 6, 20, 10, 0),
        endDate: new Date(2023, 6, 20, 16, 0),
        createdAt: new Date(2023, 6, 5),
        organization: 'UTICA',
        participants: 200,
        technology: 'Formation',
      },
      {
        id: '3',
        title: 'Journée de recrutement',
        description:
          'Rencontre avec les entreprises qui recrutent. Cette journée offre une opportunité unique de rencontrer directement des recruteurs de diverses entreprises à la recherche de nouveaux talents. Préparez votre CV et venez nombreux pour saisir ces opportunités professionnelles.',
        location: 'Centre de conférences',
        startDate: new Date(2023, 7, 10, 9, 0),
        endDate: new Date(2023, 7, 10, 18, 0),
        createdAt: new Date(2023, 7, 1),
        organization: 'Centre de conférences',
        participants: 300,
        technology: 'Recrutement',
      },
      {
        id: '4',
        title: 'Atelier de développement web',
        description:
          "Apprendre les bases du développement web. Cet atelier pratique vous permettra d'acquérir les compétences fondamentales en HTML, CSS et JavaScript. Vous réaliserez votre premier site web sous la supervision d'experts du domaine.",
        location: 'Salle de formation',
        startDate: new Date(2025, 3, 5, 9, 0),
        endDate: new Date(2025, 3, 5, 17, 0),
        createdAt: new Date(2023, 2, 15),
        organization: 'TechLearn',
        participants: 50,
        technology: 'Web Development',
      },
      {
        id: '5',
        title: "Conférence sur l'IA",
        description:
          "Les dernières avancées en intelligence artificielle. Cette conférence réunira des experts internationaux qui présenteront les innovations récentes dans le domaine de l'intelligence artificielle et leurs applications dans divers secteurs.",
        location: 'Centre de conférences',
        startDate: new Date(2025, 4, 12, 10, 0),
        endDate: new Date(2025, 4, 12, 16, 0),
        createdAt: new Date(2023, 3, 20),
        organization: 'AI Research Group',
        participants: 150,
        technology: 'Intelligence Artificielle',
        responsiblePerson: {
          id: '101',
          email: 'expert@ia.com',
          description: 'Expert en IA',
        },
      },
      {
        id: '6',
        title: 'Hackathon innovation',
        description:
          "48h pour développer un projet innovant. Ce hackathon est l'occasion de mettre en pratique vos compétences en développement et de travailler en équipe sur des projets concrets. Des prix seront attribués aux meilleures solutions.",
        location: 'UTICA',
        startDate: new Date(2025, 5, 15, 9, 0),
        endDate: new Date(2025, 5, 17, 18, 0),
        createdAt: new Date(2023, 4, 10),
        organization: 'TechInnovate',
        participants: 100,
        technology: 'Innovation',
      },
    ];

    this.event = mockEvents.find((event) => event.id === id) || null;
  }

  loadMockPostes(): void {
    // Simuler le chargement des postes disponibles
    this.postes = [
      {
        id: '1',
        title: 'Responsable logistique',
        type: 'Bénévole',
        description:
          "Gérer tous les aspects logistiques de l'événement, y compris la coordination des équipements, des installations et des ressources nécessaires.",
        competences: [
          'Organisation',
          'Gestion du temps',
          'Communication',
          'Résolution de problèmes',
        ],
      },
      {
        id: '2',
        title: 'Responsable communication',
        type: 'Bénévole',
        description:
          "Élaborer et mettre en œuvre la stratégie de communication de l'événement, y compris les médias sociaux, les relations publiques et la création de contenu.",
        competences: [
          'Rédaction',
          'Médias sociaux',
          'Relations publiques',
          'Créativité',
        ],
      },
      {
        id: '3',
        title: 'Responsable technique',
        type: 'Bénévole',
        description:
          "Assurer le bon fonctionnement de tous les aspects techniques de l'événement, y compris l'audiovisuel, l'informatique et les équipements spécialisés.",
        competences: [
          'Connaissances techniques',
          'Résolution de problèmes',
          'Adaptabilité',
          'Travail sous pression',
        ],
      },
      {
        id: '4',
        title: 'Coordinateur des bénévoles',
        type: 'Bénévole',
        description:
          "Recruter, former et superviser l'équipe de bénévoles, en veillant à ce que chacun comprenne son rôle et ses responsabilités.",
        competences: [
          'Leadership',
          "Gestion d'équipe",
          'Communication',
          'Organisation',
        ],
      },
      {
        id: '5',
        title: 'Responsable accueil',
        type: 'Bénévole',
        description:
          "Coordonner l'accueil des participants, l'enregistrement et fournir des informations sur l'événement.",
        competences: [
          'Service client',
          'Communication',
          'Patience',
          'Multilinguisme (un plus)',
        ],
      },
      {
        id: '6',
        title: 'Photographe/Vidéaste',
        type: 'Bénévole',
        description:
          "Capturer les moments clés de l'événement en photo et vidéo pour la documentation et la promotion future.",
        competences: ['Photographie', 'Vidéographie', 'Montage', 'Créativité'],
      },
    ];
  }

  updateDisplayedPostes(): void {
    const startIndex = this.currentPosteIndex;
    const endIndex = startIndex + this.postesPerPage;
    this.displayedPostes = this.postes.slice(startIndex, endIndex);
  }

  prevPostes(): void {
    if (this.currentPosteIndex > 0) {
      this.currentPosteIndex = Math.max(
        0,
        this.currentPosteIndex - this.postesPerPage
      );
      this.updateDisplayedPostes();
    }
  }

  nextPostes(): void {
    if (this.currentPosteIndex + this.postesPerPage < this.postes.length) {
      this.currentPosteIndex += this.postesPerPage;
      this.updateDisplayedPostes();
    }
  }

  isUpcoming(event: Event): boolean {
    return new Date(event.startDate) > new Date();
  }

  goBack(): void {
    this.location.back();
  }

  openApplyForm(poste: Poste): void {
    this.selectedPoste = poste;
    this.showApplyModal = true;
    this.applyForm.reset();
    this.applyForm.patchValue({ terms: false });
    this.fileName = '';
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
    this.selectedPoste = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    } else {
      this.fileName = '';
    }
  }

  submitApplication(): void {
    if (this.applyForm.invalid) return;

    this.submitting = true;

    // Simuler un délai de traitement
    setTimeout(() => {
      console.log('Candidature soumise:', {
        poste: this.selectedPoste?.title,
        nom: this.applyForm.value.name,
        email: this.applyForm.value.email,
        telephone: this.applyForm.value.phone,
        motivation: this.applyForm.value.motivation,
        experience: this.applyForm.value.experience,
        fichier: this.fileName,
      });

      this.submitting = false;
      this.closeApplyModal();

      alert(
        'Votre candidature a été soumise avec succès! Nous vous contacterons prochainement.'
      );
    }, 1500);
  }
}
