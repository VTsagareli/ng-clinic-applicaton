import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // 👈 Adjust path if needed

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <aside class="side-menu">
      <ul>
        <li><a routerLink="/appointments">Appointments</a></li>
        <li><a routerLink="/patients">Patients</a></li>
        <li><a routerLink="/doctors">Doctors</a></li>
      </ul>
      <button class="logout-button" (click)="logout()">Logout</button>
    </aside>
  `,
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Logout failed:', error);
    });
  }
}
