import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Observable } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentCreateComponent } from "../appointment-create/appointment-create.component";

@Component({
  standalone: true,
  selector: 'app-appointment-list',
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, AppointmentCreateComponent],
  styleUrls: ['./appointment-list.component.css'],
  template: `
<div class="appointment-container" *ngIf="appointments$ | async as appointments; else loading">
  <app-appointment-create></app-appointment-create>
  <h2>Scheduled Appointments</h2>
  <mat-table [dataSource]="appointments" class="appointments-table" matSort>

    <!-- FirstName Column -->
    <ng-container matColumnDef="firstName">
      <mat-header-cell *matHeaderCellDef> First Name </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.firstName}} </mat-cell>
    </ng-container>

    <!-- Last Name Column -->
    <ng-container matColumnDef="lastName">
      <mat-header-cell *matHeaderCellDef> Last Name </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.lastName}} </mat-cell>
    </ng-container>

    <!-- Type Column -->
    <ng-container matColumnDef="type">
      <mat-header-cell *matHeaderCellDef> Type </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.type}} </mat-cell>
    </ng-container>

    <!-- Doctor Column -->
    <ng-container matColumnDef="doctorId">
      <mat-header-cell *matHeaderCellDef> Doctor </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.doctorId}} </mat-cell>
    </ng-container>

    <!-- Date Column -->
    <ng-container matColumnDef="date">
      <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.date | date: 'shortDate'}} </mat-cell>
    </ng-container>

    <!-- Time Column -->
    <ng-container matColumnDef="time">
      <mat-header-cell *matHeaderCellDef> Time </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.date | date: 'shortTime'}} </mat-cell>
    </ng-container>

    <!-- Patient ID Column -->
    <ng-container matColumnDef="patientId">
      <mat-header-cell *matHeaderCellDef> Patient ID </mat-header-cell>
      <mat-cell *matCellDef="let appointment"> {{appointment.patientId}} </mat-cell>
    </ng-container>

    <!-- Header and Rows -->
    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
    <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
  </mat-table>
</div>

<!-- Loading Spinner -->
<ng-template #loading>
  <div class="loading-spinner-container">
    <mat-spinner></mat-spinner>
    <p>Loading appointments...</p>
  </div>
</ng-template>
`
})
export class AppointmentListComponent implements OnInit {
  appointments$: Observable<Appointment[]>;
  displayedColumns: string[] = ['firstName','lastName','type', 'doctorId', 'date', 'time', 'patientId'];

  constructor(private appointmentService: AppointmentService) {
    this.appointments$ = this.appointmentService.getAppointments();
  }

  ngOnInit(): void {
    this.appointments$ = this.appointmentService.getAppointments();
  }
}
