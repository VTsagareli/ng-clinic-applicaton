import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { Observable } from 'rxjs';
import { Patient } from '../../../core/models/patient.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-patient-list',
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  styleUrls: ['./patient-list.component.css'],
  template: `
<div class="patient-container" *ngIf="patients$ | async as patients; else loading">
  <h2>Patients</h2>
  
  <mat-table [dataSource]="patients" class="patients-table" matSort>

    <!-- First Name Column -->
    <ng-container matColumnDef="firstName">
      <mat-header-cell *matHeaderCellDef> First Name </mat-header-cell>
      <mat-cell *matCellDef="let patient"> {{patient.firstName}} </mat-cell>
    </ng-container>

    <!-- Last Name Column -->
    <ng-container matColumnDef="lastName">
      <mat-header-cell *matHeaderCellDef> Last Name </mat-header-cell>
      <mat-cell *matCellDef="let patient"> {{patient.lastName}} </mat-cell>
    </ng-container>

    <!-- Phone Number Column -->
    <ng-container matColumnDef="phoneNumber">
      <mat-header-cell *matHeaderCellDef> Phone Number </mat-header-cell>
      <mat-cell *matCellDef="let patient"> {{patient.phoneNumber}} </mat-cell>
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
    <p>Loading patients...</p>
  </div>
</ng-template>
`
})
export class PatientListComponent implements OnInit {
  patients$: Observable<Patient[]>;
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber'];

  constructor(private patientService: PatientService) {
    this.patients$ = this.patientService.getPatients();
  }

  ngOnInit(): void {
    this.patients$ = this.patientService.getPatients();
  }
}
