import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn) {
      // 👈 no parentheses
      return true;
    }

    alert('You must log in to access this page!');
    this.router.navigateByUrl('/'); // use root route (login/home)
    return false;
  }
}
