import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentListComponent } from '../app/features/appointment/appointment-list/appointment-list.component'
import { AppointmentCreateComponent } from "./features/appointment/appointment-create/appointment-create.component";
import { RouterModule } from '@angular/router';
import { SideNavComponent } from './shared/components/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    AppointmentListComponent,
    AppointmentCreateComponent,
    SideNavComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
logout() {
throw new Error('Method not implemented.');
}
  title = 'ng-clinic-application';
}
