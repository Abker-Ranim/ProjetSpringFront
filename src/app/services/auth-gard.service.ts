import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1. Vérifiez si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Récupérez le rôle requis depuis data.roles
    const requiredRoles = route.data['roles'] as Array<string>;

    // 3. Si aucune restriction de rôle, autorisez l'accès
    if (!requiredRoles) {
      return true;
    }

    // 4. Récupérez le rôle de l'utilisateur
    const userRole = this.authService.getRole();

    // 5. Vérifiez que le rôle est valide
    if (!userRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // 6. Comparez les rôles (en majuscules pour éviter les problèmes de casse)
    const hasRequiredRole = requiredRoles.some(
      (role) => role.toUpperCase() === userRole.toUpperCase()
    );

    if (!hasRequiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
