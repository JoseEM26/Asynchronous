import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUserValue;
    const allowedRoles = route.data['roles'] as Array<string>;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = user.rol?.nombre?.toUpperCase();

    if (allowedRoles && allowedRoles.length > 0) {
      if (allowedRoles.includes(userRole || '')) {
        return true;
      } else {
        // Redirigir al dashboard si no tiene permiso
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }
}
