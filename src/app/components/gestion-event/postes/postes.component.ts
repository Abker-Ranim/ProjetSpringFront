import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import { RouterModule,  ActivatedRoute,  Router } from "@angular/router"

interface Poste {
  id: string
  title: string
  description: string
 status : string
  competences?: string[]
  teamId: string
}

interface Team {
  id: string
  name: string
  description: string
}

@Component({
  selector: "app-postes",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./postes.component.html",
  styleUrls: ["./postes.component.css"],
})
export class PostesComponent implements OnInit {
  event: any = {
    id: "1",
    title: "Tech Conference 2025",
    postes: [
      {
        id: "1",
        title: "Responsable logistique",
        description: "Organiser la logistique de l'événement.",
        status: "Logistique",
        competences: ["Planification", "Gestion d'équipe"],
        teamId: "1",
      },
      {
        id: "2",
        title: "Coordinateur média",
        description: "Gérer la couverture médiatique.",
        status: "Médias",
        competences: ["Photographie", "Réseaux sociaux"],
        teamId: "2",
      },
    ],
  }
  teams: Team[] = [
    { id: "1", name: "Logistics Team", description: "Handles event setup" },
    { id: "2", name: "Media Team", description: "Manages photography and video" },
  ]
  displayedPostes: Poste[] = []
  postesPerPage = 3
  currentPosteIndex = 0
  showAddPostForm = false
  showApplyForm = false
  selectedPoste: Poste | null = null
  addPostForm: FormGroup
  applyForm: FormGroup
  submitting = false
  userRole = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.addPostForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      teamId: ["", Validators.required],
      status: [""],
      competences: [""],
    })

    this.applyForm = this.formBuilder.group({
      motivation: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.updateDisplayedPostes()
    this.route.queryParams.subscribe((params) => {
      this.showAddPostForm = params["addPost"] === "true"
    })

    // Get user role from localStorage
    this.userRole = localStorage.getItem("userRole") || ""
  }

  updateDisplayedPostes(): void {
    const start = this.currentPosteIndex * this.postesPerPage
    const end = start + this.postesPerPage
    this.displayedPostes = this.event.postes.slice(start, end)
  }

  prevPostes(): void {
    if (this.currentPosteIndex > 0) {
      this.currentPosteIndex--
      this.updateDisplayedPostes()
    }
  }

  nextPostes(): void {
    if ((this.currentPosteIndex + 1) * this.postesPerPage < this.event.postes.length) {
      this.currentPosteIndex++
      this.updateDisplayedPostes()
    }
  }

  canApply(): boolean {
    return this.userRole === "VOLUNTARY" || this.userRole === "RESPONSIBLE" ;
  }

  isAdmin(): boolean {
    return this.userRole === "ADMIN"
  }

  openApplyForm(poste: Poste): void {
    this.selectedPoste = poste
    this.showApplyForm = true
  }

  closeApplyForm(): void {
    this.showApplyForm = false
    this.selectedPoste = null
    this.applyForm.reset()
  }

  submitApplication(): void {
    if (this.applyForm.invalid) return
    this.submitting = true

    // Here you would normally send the application to your backend
    setTimeout(() => {
      this.submitting = false
      this.closeApplyForm()
      alert("Votre candidature a été envoyée avec succès!")
    }, 1000)
  }

  openAddPostForm(): void {
    if (this.teams.length === 0) {
      alert("Veuillez créer une équipe avant d'ajouter un poste.")
      this.router.navigate(["teams"], { relativeTo: this.route, queryParams: { addTeam: true } })
      return
    }
    this.showAddPostForm = true
  }

  closeAddPostForm(): void {
    this.showAddPostForm = false
    this.addPostForm.reset()
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addPost: null },
      queryParamsHandling: "merge",
    })
  }

  submitPost(): void {
    if (this.addPostForm.invalid) return
    this.submitting = true

    const postData: Poste = {
      id: Date.now().toString(),
      title: this.addPostForm.value.title,
      description: this.addPostForm.value.description,
      status: this.addPostForm.value.status || "General",
      competences: this.addPostForm.value.competences
        ? this.addPostForm.value.competences.split(",").map((c: string) => c.trim())
        : [],
      teamId: this.addPostForm.value.teamId,
    }

    // Here you would normally send the new post to your backend
    setTimeout(() => {
      this.event.postes.push(postData)
      this.updateDisplayedPostes()
      this.submitting = false
      this.closeAddPostForm()
      alert("Poste ajouté avec succès !")
    }, 1000)
  }

  getTeamName(teamId: string): string {
    return this.teams.find((t) => t.id === teamId)?.name || "Unknown Team"
  }
}
