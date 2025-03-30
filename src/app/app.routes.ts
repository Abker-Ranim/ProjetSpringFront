import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BodyComponent } from './common/body/body.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth-gard.service';
import { EventComponent } from './components/event/event.component';
import { AcceuilComponent } from './components/acceuil/acceuil.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';

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
    component: BodyComponent, 
    canActivate: [AuthGuard], 
    data: { role: ['ADMIN'] }, 
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'event', component: EventComponent },
      { path: "events/:id", component: EventDetailComponent },
    ],
  },

  // Routes pour les responsibles
  {
    path: 'responsible',
    component: BodyComponent,
    canActivate: [AuthGuard], 
    data: { role: 'responsible' }, 
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
    canActivate: [AuthGuard], 
    data: { role: ['VOLUNTARY'] }, 
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'event', component: EventComponent },
      { path: "events/:id", component: EventDetailComponent },

    ],
  },

  // Route pour les chemins inconnus
  {
    path: '**',
    component: NotFoundComponent,
  },
];
