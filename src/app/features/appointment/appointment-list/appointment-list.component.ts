import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentCreateComponent } from "../appointment-create/appointment-create.component";
import { RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-appointment-list',
  styleUrls: ['./appointment-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AppointmentCreateComponent,
    RouterModule
  ],
  template: `
    <div class="appointment-container">
      <div class="appointments-header">
        <h3>Scheduled Appointments</h3>
        <button class="add-appointment-button" (click)="showModal = true">Add New +</button>
      </div> 
    
      <!-- AppointmentCreateComponent modal trigger -->
      <app-appointment-create 
        [showModal]="showModal" 
        (closeModalEvent)="showModal = false">
      </app-appointment-create>
  

      <mat-table [dataSource]="dataSource" class="appointments-table" matSort>

        <!-- First Name Column -->
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

        <!-- Doctor Name Column -->
        <ng-container matColumnDef="doctorName">
          <mat-header-cell *matHeaderCellDef> Doctor Name </mat-header-cell>
          <mat-cell *matCellDef="let appointment"> {{appointment.doctorName}} </mat-cell>
        </ng-container>

        <!-- Header and Row Definitions -->
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>

      <mat-paginator [pageSize]="15" [pageSizeOptions]="[1, 2, 3]" showFirstLastButtons></mat-paginator>
    </div>
  `
})
export class AppointmentListComponent implements OnInit {
  showModal: boolean = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'type', 'date', 'time', 'doctorName'];
  dataSource = new MatTableDataSource<Appointment>([]);
  showSlider = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAppointmentsWithDetails().pipe(
      catchError(error => {
        console.error('Error fetching appointments:', error);
        return of([]);
      })
    ).subscribe(appointments => {
      this.dataSource.data = appointments;
      this.dataSource.paginator = this.paginator;
    });
  }

  openModal() {
    this.showModal = true;
  }
}
