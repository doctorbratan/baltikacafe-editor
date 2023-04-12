import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-layout',
  templateUrl: './edit-layout.component.html',
  styleUrls: ['./edit-layout.component.css']
})
export class EditLayoutComponent {

  constructor (private authService: AuthService) {}

  logout() {
    this.authService.logout()
  }

}
