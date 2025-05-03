import { Component, OnInit } from "@angular/core";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TeamService, Team } from "../../../services/team.service";
@Component({
  selector: "app-teams",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
})
export class TeamsComponent implements OnInit {
  showAddForm = false;
  eventId!: number;
  teams: Team[] = [];
  addForm: FormGroup;
  submitting = false;
  userRole = "";
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private teamService: TeamService
  ) {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.showAddForm = params["addTeam"] === "true";
    });
    this.eventId = Number(this.route.snapshot.parent?.params["id"]);
    this.userRole = localStorage.getItem("userRole") || "";
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.teamService.getTeamsByEventId(this.eventId).subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('Teams loaded:', teams);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.loading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.userRole === "ADMIN";
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTeam: "true" },
      queryParamsHandling: "merge",
    });
  }

  closeAddForm(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTeam: null },
      queryParamsHandling: "merge",
    });
    this.showAddForm = false;
    this.addForm.reset();
  }

  submitApplication(): void {
    if (this.addForm.invalid) return;
    this.submitting = true;

    const teamData: Team = {
      id: 0,
      name: this.addForm.value.name,
      description: this.addForm.value.description,
    };

    this.teamService.createTeam(teamData, this.eventId).subscribe({
      next: (team) => {
        console.log('Team created:', team);
        this.loadTeams();
        this.submitting = false;
        this.closeAddForm();
        alert("Équipe ajoutée avec succès! Un poste de responsable a été créé.");
      },
      error: (err) => {
        console.error('Error creating team:', err);
        alert("Erreur lors de l'ajout de l'équipe.");
        this.submitting = false;
      }
    });
  }
}