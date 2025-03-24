import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importez Router pour la redirection

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent implements OnInit {
  fullName: any = localStorage.getItem('userName');

 // constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
   // this.authService.logout(); // Appelez la méthode logout du service
  }
}
