import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: any

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  login(data: any): Observable<{message: string, token: string}> {
    return this.http.post<{message: string, token: string}>(`${environment.apiURL}/api/auth/login`, data)
      .pipe(
        tap(
          ({token}) => {
            this.setToken(token);
            localStorage.setItem('auth-token', token);
            this.router.navigate(['/categories'])
          }
        ))
  };



  setToken(token: any) {
    this.token = token
  }


  getToken(): string {
    return this.token
  }


  isAuthenticated(): boolean {
    return this.token
  }


  logout() {
    this.setToken(null)
    localStorage.clear()
    this.router.navigate(
      ['/login']
    /*
    {
      queryParams: 
      {
        accessDenied: true,
        sessionFailed: true
      }
     } 
     */
     )
  }

  
}
