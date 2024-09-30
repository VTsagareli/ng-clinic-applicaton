import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <aside class="side-menu">
      <ul>
        <li><a routerLink="/profile">Profile</a></li>
        <li><a routerLink="/appointments">Appointments</a></li>
        <li><a routerLink="/patients">Patients</a></li>
        <li><a routerLink="/doctors">Doctors</a></li>
        <li><button (click)="logout()">Logout</button></li>
      </ul>
    </aside>
  `,
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  logout() {
    // Implement logout logic here
  }
}
