import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
    ) { }
  
  
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      if (this.auth.isAuthenticated()) {
        return of(true);
      } else {
        this.auth.logout()
        return of(false);
      }
  }


}


// | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree