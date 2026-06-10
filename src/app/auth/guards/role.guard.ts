import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const allowedRoles = route.data['roles'] as Array<string>;
    
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const userRoles = this.authService.getCurrentUserRoles();

    if (userRoles && allowedRoles.some(role => userRoles.includes(role))) {
      return true;
    }

    // Not authorized
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
