import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamService, Team } from "../../../services/team.service";
import { PosteService, Poste } from "../../../services/poste.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-postes",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./postes.component.html",
  styleUrls: ["./postes.component.css"],
})
export class PostesComponent implements OnInit {
  eventId!: number;
  teams: Team[] = [];
  displayedPostes: Poste[] = [];
  postes: Poste[] = [];
  postesPerPage = 3;
  currentPosteIndex = 0;
  showApplyForm = false;
  selectedPoste: Poste | null = null;
  applyForm: FormGroup;
  submitting = false;
  userRole = "";
  loadingTeams = true;
  loadingPostes = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private posteService: PosteService,
    private http: HttpClient,
    private authService: AuthService // Ajouté
  ) {
    this.applyForm = this.formBuilder.group({
      motivation: ["", Validators.required],
      experience: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.parent?.params["id"]);
    this.userRole = localStorage.getItem("userRole") || "";
    this.loadTeams();
  }

  loadTeams(): void {
    this.loadingTeams = true;
    this.teamService.getTeamsByEventId(this.eventId).subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('Teams loaded in PostesComponent:', teams);
        this.loadPostes();
        this.loadingTeams = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.loadingTeams = false;
      }
    });
  }

  loadPostes(): void {
    this.loadingPostes = true;
    this.postes = [];
    const loadPostesObservables = this.teams.map(team =>
      this.posteService.getPostesByTeamId(team.id)
    );

    Promise.all(loadPostesObservables.map(obs => obs.toPromise())).then(results => {
      results.forEach((teamPostes, index) => {
        const postesToAdd = teamPostes || [];
        this.postes = [...this.postes, ...postesToAdd];
      });
      this.updateDisplayedPostes();
      console.log('Postes loaded:', this.postes);
      this.loadingPostes = false;
    }).catch(err => {
      console.error('Error loading postes:', err);
      this.loadingPostes = false;
    });
  }

  updateDisplayedPostes(): void {
    const start = this.currentPosteIndex * this.postesPerPage;
    const end = start + this.postesPerPage;
    this.displayedPostes = this.postes.slice(start, end);
  }

  prevPostes(): void {
    if (this.currentPosteIndex > 0) {
      this.currentPosteIndex--;
      this.updateDisplayedPostes();
    }
  }

  nextPostes(): void {
    if ((this.currentPosteIndex + 1) * this.postesPerPage < this.postes.length) {
      this.currentPosteIndex++;
      this.updateDisplayedPostes();
    }
  }

  canApply(): boolean {
    return this.userRole === "USER" || this.userRole === "VOLUNTARY";
  }

  isAdmin(): boolean {
    return this.userRole === "ADMIN";
  }

  openApplyForm(poste: Poste): void {
    this.selectedPoste = poste;
    this.showApplyForm = true;
  }

  closeApplyForm(): void {
    this.showApplyForm = false;
    this.selectedPoste = null;
    this.applyForm.reset();
  }

  submitApplication(): void {
    if (this.applyForm.invalid || !this.selectedPoste) return;
    this.submitting = true;

    const roleRequest = {
      requestedRole: "USER",
      eventId: this.eventId,
      posteId: this.selectedPoste.id
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, // Utilisation de AuthService
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8089/SpringMVC/api/v1/role-request', roleRequest, {
      headers: headers,
      params: {
        experience: this.applyForm.value.experience,
        description: this.applyForm.value.motivation
      }
    }).subscribe({
      next: (response) => {
        console.log('Application submitted:', response);
        this.submitting = false;
        this.closeApplyForm();
        alert("Votre candidature a été envoyée avec succès!");
      },
      error: (err) => {
        console.error('Error submitting application:', err);
        let errorMessage = "Erreur lors de l'envoi de votre candidature.";
        if (err.status === 400) {
          errorMessage += " Vérifiez les données saisies.";
        } else if (err.status === 403) {
          errorMessage += " Vous n'êtes pas autorisé à effectuer cette action.";
        }
        alert(errorMessage);
        this.submitting = false;
      }
    });
  }

  getTeamName(teamId: number): string {
    return this.teams.find((t) => t.id === teamId)?.name || "Unknown Team";
  }
}