import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const potentialToken = localStorage.getItem('auth-token');

    if (!potentialToken) {
      this.router.navigate(['/login'])
    } else {
      this.authService.setToken(potentialToken);
    }
  
  }
}
