import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BodyComponent } from './common/body/body.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth-gard.service';
import { NewEventComponent } from './components/new-event/new-event.component';
import { EventComponent } from './components/event/event.component';
import { AcceuilComponent } from './components/acceuil/acceuil.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'acceuil',
    pathMatch: 'full',
  },
  {
    path: 'acceuil',
    component: AcceuilComponent,
  },
  { path: 'login', component: LoginComponent },

  // Routes pour les admins
  {
    path: 'admin',
    component: BodyComponent, // Contient les routes enfants pour l'admin
    canActivate: [AuthGuard], // Vérifie que l'utilisateur est authentifié
    data: { role: ['ADMIN'] }, // Rôle attendu pour accéder à ces routes
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'newEvent', component: NewEventComponent },
    ],
  },

  // Routes pour les responsibles
  {
    path: 'responsible',
    component: BodyComponent,
    canActivate: [AuthGuard], // Vérifie que l'utilisateur est authentifié
    data: { role: 'responsible' }, // Rôle attendu pour accéder à ces routes
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'event', component: EventComponent },
    ],
  },

  // Routes pour voluntary
  {
    path: 'voluntary',
    component: BodyComponent,
    canActivate: [AuthGuard], // Vérifie que l'utilisateur est authentifié
    data: { role: ['VOLUNTARY'] }, // Rôle attendu pour accéder à ces routes
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'event', component: EventComponent },
    ],
  },

  // Route pour les chemins inconnus
  {
    path: '**',
    component: NotFoundComponent,
  },
];
