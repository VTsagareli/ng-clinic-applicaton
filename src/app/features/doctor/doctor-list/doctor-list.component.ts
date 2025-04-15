import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { Observable } from 'rxjs';
import { Doctor, Availability } from '../../../core/models/doctor.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-doctor-list',
  imports: [CommonModule, FormsModule, MatTableModule, MatProgressSpinnerModule],
  styleUrls: ['./doctor-list.component.scss'],
  template: `
    <div class="section-wrapper" *ngIf="doctors$ | async as doctors; else loading">
      <div class="section-header">
        <h3>Doctors</h3>
        <button class="add-button" (click)="openModal()">Add Doctor</button>
      </div>

      <mat-table [dataSource]="doctors" class="doctors-table" matSort>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
          <mat-cell *matCellDef="let doctor"> {{ doctor.name }} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="specialization">
          <mat-header-cell *matHeaderCellDef> Specialization </mat-header-cell>
          <mat-cell *matCellDef="let doctor"> {{ doctor.specialization }} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> </mat-header-cell>
          <mat-cell *matCellDef="let doctor">
            <button class="delete-button" (click)="deleteDoctor(doctor.id)">✕</button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>

    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <button class="close-button" (click)="closeModal()">×</button>
        <h2>Add Doctor</h2>
        <form (ngSubmit)="addDoctor()">
          <input [(ngModel)]="newDoctor.name" name="name" placeholder="Doctor Name" required />

          <select [(ngModel)]="newDoctor.specialization" name="specialization" required>
            <option value="" disabled selected>Select Specialization</option>
            <option *ngFor="let type of appointmentTypes" [value]="type">{{ type }}</option>
          </select>

          <label>Availability:</label>
          <div *ngFor="let avail of newDoctor.availability; let i = index">
            <select [(ngModel)]="avail.dayOfWeek" name="dayOfWeek{{i}}" required>
              <option [value]="d" *ngFor="let d of [0,1,2,3,4,5,6]">{{ dayOfWeekToText(d) }}</option>
            </select>
            <input [(ngModel)]="avail.startTime" name="startTime{{i}}" placeholder="Start Time (e.g. 09:00)" required />
            <input [(ngModel)]="avail.endTime" name="endTime{{i}}" placeholder="End Time (e.g. 17:00)" required />
          </div>
          <button type="button" (click)="addAvailability()">+ Add Availability</button>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>

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
  displayedColumns: string[] = ['name', 'specialization', 'actions'];
  showModal = false;

  appointmentTypes: string[] = ['First Consultation', 'Follow Up', 'Extensive', 'Operation'];

  newDoctor: Omit<Doctor, 'id'> = {
    name: '',
    specialization: '',
    availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]
  };

  constructor(private doctorService: DoctorService) {
    this.doctors$ = this.doctorService.getDoctors();
  }

  ngOnInit(): void {}

  dayOfWeekToText(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day] || 'Unknown';
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newDoctor = {
      name: '',
      specialization: '',
      availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]
    };
  }

  addAvailability() {
    this.newDoctor.availability.push({ dayOfWeek: 1, startTime: '', endTime: '' });
  }

  async addDoctor() {
    await this.doctorService.createDoctor(this.newDoctor);
    this.closeModal();
    this.refreshDoctors();
  }

  async deleteDoctor(id: string) {
    await this.doctorService.deleteDoctor(id);
    this.refreshDoctors();
  }

  refreshDoctors() {
    this.doctors$ = this.doctorService.getDoctors();
  }
}
