import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { Observable } from 'rxjs';
import { Doctor } from '../../../core/models/doctor.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-doctor-list',
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  styleUrls: ['./doctor-list.component.css'],
  template: `
<div class="doctor-container" *ngIf="doctors$ | async as doctors; else loading">
  <h2>Doctors</h2>
  
  <mat-table [dataSource]="doctors" class="doctors-table" matSort>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
      <mat-cell *matCellDef="let doctor"> {{doctor.name}} </mat-cell>
    </ng-container>

    <!-- Specialization Column -->
    <ng-container matColumnDef="specialization">
      <mat-header-cell *matHeaderCellDef> Specialization </mat-header-cell>
      <mat-cell *matCellDef="let doctor"> {{doctor.specialization}} </mat-cell>
    </ng-container>

    <!-- Availability Column -->
    <ng-container matColumnDef="availability">
      <mat-header-cell *matHeaderCellDef> Availability </mat-header-cell>
      <mat-cell *matCellDef="let doctor">
        <div *ngFor="let avail of doctor.availability">
          {{ dayOfWeekToText(avail.dayOfWeek) }}: {{ avail.startTime }} - {{ avail.endTime }}
        </div>
      </mat-cell>
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
    <p>Loading doctors...</p>
  </div>
</ng-template>
`
})
export class DoctorListComponent implements OnInit {
  doctors$: Observable<Doctor[]>;
  displayedColumns: string[] = ['name', 'specialization', 'availability'];

  constructor(private doctorService: DoctorService) {
    this.doctors$ = this.doctorService.getDoctors();
  }

  ngOnInit(): void {
    this.doctors$ = this.doctorService.getDoctors();
  }

  dayOfWeekToText(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  }
}
