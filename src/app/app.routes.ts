import { Routes } from '@angular/router';
import { AppointmentListComponent } from '../app/features/appointment/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from '../app/features/appointment/appointment-create/appointment-create.component';
import { PatientListComponent } from '../app/features/patient/patient-list/patient-list.component';
import { PatientCreateComponent } from '../app/features/patient/patient-create/patient-create.component';
import { DoctorListComponent } from '../app/features/doctor/doctor-list/doctor-list.component';
import { DoctorCreateComponent } from '../app/features/doctor/doctor-create/doctor-create.component';
import { LoginComponent } from '../app/auth/login/login.components';
import { RegisterComponent } from '../app/auth/register/register.component';
import { AuthGuard } from '../app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'appointments',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AppointmentListComponent },
      { path: 'create', component: AppointmentCreateComponent },
    ],
  },
  {
    path: 'patients',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PatientListComponent },
      { path: 'create', component: PatientCreateComponent },
    ],
  },
  {
    path: 'doctors',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DoctorListComponent },
      { path: 'create', component: DoctorCreateComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } // catch-all fallback
];
