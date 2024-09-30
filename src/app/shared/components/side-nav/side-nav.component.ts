import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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
      </ul>
      <button class="logout-button" (click)="logout()">Logout</button>
    </aside>
  `,
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  constructor(private router: Router){}
  logout() {
    console.log("auth not yet implemented");
    // this.router.navigate(['/login']);  
  }
}
