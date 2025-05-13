import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import  { Router } from "@angular/router"

@Component({
  selector: "app-acceuil",
  imports: [CommonModule],
  templateUrl: "./acceuil.component.html",
  styleUrl: "./acceuil.component.css",
})
export class AcceuilComponent implements OnInit {
  featureCards = [
    {
      icon: "users",
      title: "Leadership",
    },
    {
      icon: "puzzle",
      title: "Gestion de projet",
    },
    {
      icon: "gift",
      title: "Récompenses & cadeaux",
    },
    {
      icon: "lightbulb",
      title: "Développement personnel",
    },
  ]

  events = [
    {
      title: "Forum Entreprise",
      description: `
        La 7<sup>ème</sup> édition du Forum des Entreprises de l'ENICarthage aura 
        lieu le 15 Novembre 2023 au siège de l'UTICA sous la thématique 
        du l'engagement de l'entreprise pour l'avenir de l'ingénieur.<br><br>
        Ce concept vise à mettre en valeur la contribution des entreprises à 
        créer l'avenir de l'ingénieur et met l'accent sur le rôle qu'ils jouent dans la 
        promotion et le soutien de leurs carrières
      `,
      image: "event.avif",
      position: "right",
    },
    {
      title: "Enicarthage Robots",
      description: `
        The stakes are high, and the excitement is real!<br>
        ENICarthage Robots 8.0 invites you to experience the world 
        of Casino like never before. Join us on 20 APRIL 2025 at 
        TUNIS SCIENCE CITY for a day packed with robotics 
        brilliance, innovative competitions and unforgettable moments.<br><br>
        ARE YOU READY TO GAMBLE?
      `,
      image: "event.avif",
      position: "left",
    },
  ]

  ngOnInit(): void {
    window.addEventListener("scroll", this.handleScroll)
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleScroll = (): void => {
    const navbar = document.querySelector(".navbar") as HTMLElement
    if (window.scrollY > 50) {
      navbar.style.padding = "10px 0"
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
    } else {
      navbar.style.padding = "15px 0"
      navbar.style.backgroundColor = "transparent"
      navbar.style.boxShadow = "none"
    }
  }

  getIconClass(icon: string): string {
    switch (icon) {
      case "users":
        return "fas fa-users"
      case "puzzle":
        return "fas fa-puzzle-piece"
      case "gift":
        return "fas fa-gift"
      case "lightbulb":
        return "fas fa-lightbulb"
      default:
        return "fas fa-star"
    }
  }

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(["/login"])
  }
}

