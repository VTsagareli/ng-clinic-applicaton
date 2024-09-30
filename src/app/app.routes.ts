import { Routes } from '@angular/router';
import { AppointmentListComponent } from '../app/features/appointment/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from '../app/features/appointment/appointment-create/appointment-create.component';
import { PatientListComponent } from '../app/features/patient/patient-list/patient-list.component';
import { PatientCreateComponent } from '../app/features/patient/patient-create/patient-create.component';
import { DoctorListComponent } from '../app/features/doctor/doctor-list/doctor-list.component';
import { DoctorCreateComponent } from '../app/features/doctor/doctor-create/doctor-create.component';
import { ProfileComponent } from '../app/shared/components/profile/profile.component';
import { LoginComponent } from '../app/auth/login/login.components'; // Adjust import based on your structure


export const routes: Routes = [
  {
    path: 'appointments',
    children: [
      { path: '', component: AppointmentListComponent },
      { path: 'create', component: AppointmentCreateComponent },
    ],
  },
  {
    path: 'patients',
    children: [
      { path: '', component: PatientListComponent },
      { path: 'create', component: PatientCreateComponent },
    ],
  },
  {
    path: 'doctors',
    children: [
      { path: '', component: DoctorListComponent },
      { path: 'create', component: DoctorCreateComponent },
    ],
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent }, // Add login route
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },  // Default route
];
