import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { AppointmentListComponent } from '../app/features/appointment/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './features/appointment/appointment-create/appointment-create.component';
import { SideNavComponent } from './shared/components/side-nav/side-nav.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    AppointmentListComponent,
    AppointmentCreateComponent,
    SideNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);

  shouldShowSideNav(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }

  title = 'ng-clinic-application';
}
