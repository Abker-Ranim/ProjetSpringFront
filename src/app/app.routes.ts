import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BodyComponent } from './common/body/body.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth-gard.service';
import { EventComponent } from './components/event/event.component';
import { DetailComponent } from './components/gestion-event/detail/detail.component';
import { TeamsComponent } from './components/gestion-event/teams/teams.component';
import { AcceuilComponent } from './components/acceuil/acceuil.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CandidateDetailComponent } from './components/candidatures/candidate-detail/candidate-detail.component';
import { CandidaturesComponent } from './components/candidatures/candidatures.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { UserLeaderboardComponent } from './components/user-leaderboard/user-leaderboard.component';
import { AdminCandidaturesComponent } from './components/admin-candidatures/admin-candidatures.component';
import { ResponsibleCandidatureComponent } from './components/responsible-candidature/responsible-candidature.component';
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
      { path: 'event', component: EventComponent },
      {
        path: 'events/:id',
        component: EventDetailComponent,
        children: [
          { path: '', redirectTo: 'detail', pathMatch: 'full' },
          { path: 'detail', component: DetailComponent },
          { path: 'teams', component: TeamsComponent },
        ],
      },
      { path: 'candidatures', component: CandidaturesComponent },
      { path: 'candidate-detail/:id', component: CandidateDetailComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'user-leaderboard', component: UserLeaderboardComponent },
      { path: 'admin-candidatures', component: AdminCandidaturesComponent },
    ],
  },

  // Routes pour les responsibles
  {
    path: 'responsible',
    component: BodyComponent,
    canActivate: [AuthGuard],
    data: { role: 'RESPONSIBLE' },
    children: [
      { path: 'event', component: EventComponent },
      {
        path: 'events/:id',
        component: EventDetailComponent,
        children: [
          { path: '', redirectTo: 'detail', pathMatch: 'full' },
          { path: 'detail', component: DetailComponent },
          { path: 'teams', component: TeamsComponent },
        ],
      },
      { path: 'candidatures', component: CandidaturesComponent },
      { path: 'candidate-detail/:id', component: CandidateDetailComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'user-leaderboard', component: UserLeaderboardComponent },
      { path: 'admin-candidatures', component: AdminCandidaturesComponent },
      { path: 'responsible-candidature', component:  ResponsibleCandidatureComponent },

    ],
  },

  // Routes pour voluntary
  {
    path: 'voluntary',
    component: BodyComponent,
    canActivate: [AuthGuard],
    data: { role: ['VOLUNTARY'] },
    children: [
      { path: 'event', component: EventComponent },
      {
        path: 'events/:id',
        component: EventDetailComponent,
        children: [
          { path: '', redirectTo: 'detail', pathMatch: 'full' },
          { path: 'detail', component: DetailComponent },
          { path: 'teams', component: TeamsComponent },
        ],
      },
      { path: 'candidatures', component: CandidaturesComponent },
      { path: 'candidate-detail/:id', component: CandidateDetailComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'user-leaderboard', component: UserLeaderboardComponent },
      { path: 'admin-candidatures', component: AdminCandidaturesComponent },
    ],
  },
  {
    path: 'user',
    component: BodyComponent,
    canActivate: [AuthGuard],
    data: { role: ['  USER'] },
    children: [
      { path: 'event', component: EventComponent },
      {
        path: 'events/:id',
        component: EventDetailComponent,
        children: [
          { path: '', redirectTo: 'detail', pathMatch: 'full' },
          { path: 'detail', component: DetailComponent },
          { path: 'teams', component: TeamsComponent },
        ],
      },
      { path: 'candidatures', component: CandidaturesComponent },
      { path: 'candidate-detail/:id', component: CandidateDetailComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'user-leaderboard', component: UserLeaderboardComponent },
      { path: 'admin-candidatures', component: AdminCandidaturesComponent },
      { path: 'responsible-candidature', component:  ResponsibleCandidatureComponent },

    ],
  },

  // Route pour les chemins inconnus
  {
    path: '**',
    component: NotFoundComponent,
  },
];
