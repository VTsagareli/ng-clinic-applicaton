import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  styleUrls: ['./appointment-create.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `
    <!-- Modal Form -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <button class="close-button" (click)="closeModal()">×</button>
        <h2>Create Appointment</h2>

        <!-- New Patient Flow -->
        <div *ngIf="isNewPatient">
          <form #registerForm="ngForm" (ngSubmit)="registerNewPatient()">
            <input name="firstName" [(ngModel)]="newPatient.firstName" placeholder="First Name" required />
            <input name="lastName" [(ngModel)]="newPatient.lastName" placeholder="Last Name" required />
            <input name="personalNumber" [(ngModel)]="newPatient.personalNumber" placeholder="Personal Number" required />
            <button type="submit" [disabled]="!registerForm.valid">Register</button>
          </form>
        </div>

        <!-- Existing Patient Flow -->
        <div *ngIf="!isNewPatient">
          <label>Enter Personal Number:</label>
          <input
            [(ngModel)]="personalNumber"
            (input)="onPersonalNumberInput()"
            placeholder="e.g. 123456789"
          />
          <!-- Loading Indicator -->
          <div *ngIf="searching" class="loading-indicator">
            🔄 Searching...
          </div>
          <!-- Result Messages -->
          <div *ngIf="patientFound === false" class="error-message">
            ❌ No patient found with that personal number.
          </div>
          <div *ngIf="patientFound === true" class="success-message">
            ✅ Patient found. You can now create an appointment.
          </div>

          <!-- Toggle to new patient -->
          <div class="toggle-label" (click)="togglePatientType()">
            Is This About A New Patient?
          </div>
        </div>

        <!-- Appointment Form -->
        <form
          [formGroup]="appointmentForm"
          (ngSubmit)="onSubmit()"
          *ngIf="isNewPatient || patientFound === true"
        >
          <input [value]="personalNumber" formControlName="patientId" readonly />
          <input formControlName="Doctor" placeholder="Doctor" required />
          <select formControlName="type">
            <option value="checkup">Checkup</option>
            <option value="extensive">Extensive</option>
            <option value="operation">Operation</option>
          </select>
          <input formControlName="date" type="datetime-local" required />
          <button type="submit" [disabled]="appointmentForm.invalid">Create Appointment</button>
        </form>
      </div>
    </div>
  `
})
export class AppointmentCreateComponent {
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  appointmentForm: FormGroup;
  isNewPatient = false;
  searching: boolean = false;
  private inputTimeout: any;

  newPatient = {
    firstName: '',
    lastName: '',
    personalNumber: ''
  };

  personalNumber = '';
  patientFound: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      Doctor: ['', Validators.required],
      type: ['checkup', Validators.required],
      date: ['', Validators.required],
    });
  }

  togglePatientType() {
    this.isNewPatient = !this.isNewPatient;
    this.patientFound = null;
    this.personalNumber = '';
  }

  closeModal() {
    this.resetForm();
    this.closeModalEvent.emit();
  }

  resetForm() {
    this.isNewPatient = false;
    this.personalNumber = '';
    this.patientFound = null;
    this.newPatient = { firstName: '', lastName: '', personalNumber: '' };
    this.appointmentForm.reset();
  }

  registerNewPatient() {
    const patientData = {
      ...this.newPatient,
      id: this.patientService.createId(),
      phoneNumber: '',
      appointments: []
    };

    this.patientService.createPatient(patientData).then(() => {
      this.personalNumber = this.newPatient.personalNumber;
      this.appointmentForm.controls['patientId'].setValue(this.personalNumber);
      this.newPatient = { firstName: '', lastName: '', personalNumber: '' };
      this.patientFound = true;
    });
  }

  checkPatient() {
    if (!this.personalNumber.trim()) {
      this.patientFound = null;
      return;
    }
  
    this.searching = true;
  
    this.patientService.getPatientByPersonalNumber(this.personalNumber).subscribe(patient => {
      this.searching = false;
      this.patientFound = !!patient;
  
      if (patient) {
        this.appointmentForm.controls['patientId'].setValue(this.personalNumber);
      } else {
        this.appointmentForm.controls['patientId'].reset();
      }
    });
  }  

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment = {
        ...this.appointmentForm.value,
        id: this.appointmentService.createId()
      };
      this.appointmentService.createAppointment(appointment).then(() => {
        this.closeModal();
      });
    }
  }

  onPersonalNumberInput() {
    this.searching = true; // Show loading immediately
    this.patientFound = null; // Clear any previous result
    clearTimeout(this.inputTimeout);
  
    if (!this.personalNumber.trim()) {
      this.searching = false;
      return;
    }
  
    this.inputTimeout = setTimeout(() => {
      this.patientService.getPatientByPersonalNumber(this.personalNumber).subscribe(patient => {
        this.searching = false;
        this.patientFound = !!patient;
  
        if (patient) {
          this.appointmentForm.controls['patientId'].setValue(this.personalNumber);
        } else {
          this.appointmentForm.controls['patientId'].reset();
        }
      });
    }, 500); // debounce delay
  }
  
}
