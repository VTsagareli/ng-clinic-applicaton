import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule],
  styleUrls: ['./patient-list.component.scss'],
  template: `
      <div class="section-wrapper">
        <div class="section-header">
          <h3>Registered Patients</h3>
          <button class="primary-action-button" (click)="deleteAllPatients()">Delete All Patients</button>
        </div>

        <ng-container *ngIf="patients$ | async as patients">
          <mat-table [dataSource]="patients" class="patients-table">

            <!-- Personal Number Column -->
            <ng-container matColumnDef="personalNumber">
              <mat-header-cell *matHeaderCellDef> Personal ID </mat-header-cell>
              <mat-cell *matCellDef="let patient"> {{ patient.personalNumber }} </mat-cell>
            </ng-container>

            <!-- First Name Column -->
            <ng-container matColumnDef="firstName">
              <mat-header-cell *matHeaderCellDef> First Name </mat-header-cell>
              <mat-cell *matCellDef="let patient"> {{ patient.firstName }} </mat-cell>
            </ng-container>

            <!-- Last Name Column -->
            <ng-container matColumnDef="lastName">
              <mat-header-cell *matHeaderCellDef> Last Name </mat-header-cell>
              <mat-cell *matCellDef="let patient"> {{ patient.lastName }} </mat-cell>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <mat-header-cell *matHeaderCellDef></mat-header-cell>
              <mat-cell *matCellDef="let patient">
                <button mat-icon-button color="warn" (click)="deletePatient(patient.id)">
                  <mat-icon>close</mat-icon>
                </button>
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          </mat-table>
        </ng-container>
      </div>
  `
})
export class PatientListComponent implements OnInit {
  patients$: Observable<Patient[]>;
  displayedColumns: string[] = ['personalNumber', 'firstName', 'lastName', 'actions'];

  constructor(private patientService: PatientService) {
    this.patients$ = this.patientService.getPatients().pipe(
      catchError(err => {
        console.error('Failed to fetch patients', err);
        return of([]);
      })
    );
  }

  ngOnInit(): void {}

  deletePatient(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id);
    }
  }

  deleteAllPatients() {
    if (confirm('This will permanently delete all patients. Continue?')) {
      this.patientService.deleteAllPatients();
    }
  }
}
