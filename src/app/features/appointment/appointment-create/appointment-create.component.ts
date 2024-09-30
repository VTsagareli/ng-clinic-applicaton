import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientCreateComponent } from "../../patient/patient-create/patient-create.component";
import { PatientService } from '../../../core/services/patient.service';

@Component({
  standalone: true,
  selector: 'app-appointment-create',
  styleUrls: ['./appointment-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule, PatientCreateComponent],
  template:  `
<h2 class="appointment-title">Create An Appointment</h2>
<div class="appointment-form-container">
  <div class="left-section">
    <div *ngIf="!showPatientCreate">
      <h3>Search for Patient ID</h3>
      <div [formGroup]="patientSearchForm">
        <input formControlName="firstName" placeholder="First Name" required>
        <input formControlName="lastName" placeholder="Last Name" required>
        <button (click)="searchPatientId()">Search</button>

        <div *ngIf="!searchedPatientId && searchedPatientName">
          <p>No patient found with name: {{ searchedPatientName }}</p>
        </div>
      </div>
      <button class="new-patient-btn" (click)="openModal()">New Patient</button>
    </div>
  </div>

  <ng-template #patientModal>
    <div class="modal">
      <div class="modal-content">
        <span class="close" (click)="closeModal()">&times;</span>
        <h3>Fill Out New Patient Info:</h3>
        <app-patient-create [appointmentForm]="appointmentForm" (close)="closeModal()"></app-patient-create>
      </div>
    </div>
  </ng-template>

  <div class="right-section">
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <input formControlName="patientId" placeholder="Patient ID" [value]="searchedPatientId" readonly>
      <input formControlName="Doctor" placeholder="Doctor" required>
      <select formControlName="type">
        <option value="checkup">Checkup</option>
        <option value="extensive">Extensive</option>
        <option value="operation">Operation</option>
      </select>
      <input formControlName="date" type="datetime-local" required>
      <button type="submit" [disabled]="appointmentForm.invalid">Create Appointment</button>
    </form>
  </div>

  <ng-container *ngIf="isModalOpen">
    <ng-container *ngTemplateOutlet="patientModal"></ng-container>
  </ng-container>
</div>
  `
})
export class AppointmentCreateComponent {
  appointmentForm: FormGroup;
  patientSearchForm: FormGroup; // New form group for searching patients
  isModalOpen: boolean = false; // Track modal state
  searchedPatientId: string | undefined;
  searchedPatientName: string | undefined; // To hold the searched name
  showPatientCreate: any;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private patientService: PatientService) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      Doctor: ['', Validators.required],
      type: ['checkup', Validators.required],
      date: ['', Validators.required],
    });

    // Initialize patient search form
    this.patientSearchForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  openModal() {
    this.isModalOpen = true; // Open the modal
  }

  closeModal() {
    this.isModalOpen = false; // Close the modal
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointmentData = {
        ...this.appointmentForm.value,
        id: this.appointmentService.createId()
      };
      this.appointmentService.createAppointment(appointmentData).then(() => {
        console.log('Appointment Created');
        this.appointmentForm.reset();
        this.searchedPatientId = undefined; // Reset searched patient ID after creating an appointment
      });
    }
  }

  searchPatientId() {
    const firstName = this.patientSearchForm.get('firstName')?.value;
    const lastName = this.patientSearchForm.get('lastName')?.value;

    if (firstName && lastName) {
      this.patientService.getPatientsByName(firstName, lastName).subscribe(patient => {
        if (patient) {
          this.searchedPatientId = patient.id; // Assuming patient.id contains the ID
          this.appointmentForm.controls['patientId'].setValue(this.searchedPatientId); // Set the patient ID in the form
          this.searchedPatientName = undefined; // Reset any previous search name
        } else {
          this.searchedPatientId = undefined; // Clear the ID if no patient found
          this.searchedPatientName = `${firstName} ${lastName}`; // Set searched name for display
        }
      });
    }
  }
}
