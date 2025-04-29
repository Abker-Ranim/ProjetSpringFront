import { Component,  OnInit } from "@angular/core"
import { RouterModule,  ActivatedRoute,  Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"

interface Team {
  id: string
  name: string
  description: string
}

@Component({
  selector: "app-teams",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
})
export class TeamsComponent implements OnInit {
  showAddForm = false
  eventId!: number
  teams: Team[] = [
    { id: "1", name: "Logistics Team", description: "Handles event setup" },
    { id: "2", name: "Media Team", description: "Manages photography and video" },
  ]
  addForm: FormGroup
  submitting = false
  userRole = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.addForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    })
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.showAddForm = params["addTeam"] === "true"
    })
    this.eventId = Number(this.route.snapshot.parent?.params["id"])

    // Get user role from localStorage
    this.userRole = localStorage.getItem("userRole") || ""
  }

  isAdmin(): boolean {
    return this.userRole === "ADMIN"
  }

  openAddForm(): void {
    this.showAddForm = true
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTeam: "true" },
      queryParamsHandling: "merge",
    })
  }

  closeAddForm(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addTeam: null },
      queryParamsHandling: "merge",
    })
    this.showAddForm = false
    this.addForm.reset()
  }

  submitApplication(): void {
    if (this.addForm.invalid) return
    this.submitting = true

    const teamData: Team = {
      id: Date.now().toString(),
      name: this.addForm.value.name,
      description: this.addForm.value.description,
    }

    // Here you would normally send the new team to your backend
    setTimeout(() => {
      this.teams.push(teamData)
      this.submitting = false
      this.closeAddForm()
      alert("Équipe ajoutée avec succès!")
    }, 1000)
  }
}
