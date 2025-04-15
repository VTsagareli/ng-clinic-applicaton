import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, FormControl } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content">
        <button class="close-button" (click)="closeModal()">×</button>
        <h2>Create Appointment</h2>

        <div *ngIf="isNewPatient">
          <form #registerForm="ngForm" (ngSubmit)="registerNewPatient()">
            <input name="firstName" [(ngModel)]="newPatient.firstName" placeholder="First Name" required />
            <input name="lastName" [(ngModel)]="newPatient.lastName" placeholder="Last Name" required />
            <input name="personalNumber" [(ngModel)]="newPatient.personalNumber" placeholder="Personal Number" required />
            <button type="submit" [disabled]="!registerForm.valid">Register</button>
          </form>
        </div>

        <div *ngIf="!isNewPatient">
        <div class="search-input-group">
        <input
          class="personal-number-input"
          [(ngModel)]="manualSearchInput"
          name="manualSearchInput"
          placeholder="e.g. 123456789"
        />

  <button type="button" class="search-button" (click)="manualSearch()">🔍</button>
</div>


  <div *ngIf="searching" class="loading-indicator">
    🔄 Searching...
  </div>
  <div *ngIf="patientFound === false" class="error-message">
    ❌ No patient found with that personal number.
  </div>
  <div *ngIf="patientFound === true" class="success-message">
    ✅ Patient found. You can now create an appointment.
  </div>

  <div class="toggle-label" (click)="togglePatientType()">
    Is This About A New Patient?
  </div>
</div>


        <form
          [formGroup]="appointmentForm"
          (ngSubmit)="onSubmit()"
          *ngIf="isNewPatient || patientFound === true"
        >
          <input [value]="personalNumberControl.value" formControlName="patientId" readonly />

          <select formControlName="Doctor" required>
            <option value="">Select Doctor</option>
            <option *ngFor="let doc of doctors" [value]="doc.id">
              {{ doc.name }} - {{ doc.specialization }}
            </option>
          </select>

          <select formControlName="type">
            <option value="First Consultation">First Consultation</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Extensive">Extensive</option>
            <option value="Operation">Operation</option>
          </select>
          <input formControlName="date" type="datetime-local" required />
          <button type="submit" [disabled]="appointmentForm.invalid">Create Appointment</button>
        </form>
      </div>
    </div>
  `
})
export class AppointmentCreateComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  appointmentForm: FormGroup;
  isNewPatient = false;
  searching: boolean = false;
  patientFound: boolean | null = null;

  personalNumberControl = new FormControl('', Validators.required);

  newPatient = {
    firstName: '',
    lastName: '',
    personalNumber: ''
  };

  doctors: Doctor[] = [];
manualSearchInput: string = "";

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      Doctor: ['', Validators.required],
      type: ['checkup', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(doctors => this.doctors = doctors);

    this.personalNumberControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        // if (value && value.trim()) {
        //   this.searching = true;
        //   this.patientService.getPatientByPersonalNumber(value).subscribe(patient => {
        //     this.searching = false;
        //     this.patientFound = !!patient;
        //     if (patient) {
        //       this.appointmentForm.controls['patientId'].setValue(patient.id);
        //     } else {
        //       this.appointmentForm.controls['patientId'].reset();
        //     }
        //   });
        // } else {
        //   this.patientFound = null;
        //   this.appointmentForm.controls['patientId'].reset();
        // }
      });
  }

  togglePatientType() {
    this.isNewPatient = !this.isNewPatient;
    this.patientFound = null;
    this.personalNumberControl.reset();
  }

  closeModal() {
    this.resetForm();
    this.closeModalEvent.emit();
  }

  resetForm() {
    this.isNewPatient = false;
    this.patientFound = null;
    this.newPatient = { firstName: '', lastName: '', personalNumber: '' };
    this.personalNumberControl.reset();
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
      this.personalNumberControl.setValue(this.newPatient.personalNumber);
      this.appointmentForm.controls['patientId'].setValue(patientData.id);
      this.newPatient = { firstName: '', lastName: '', personalNumber: '' };
      this.patientFound = true;
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointment = {
        ...this.appointmentForm.value,
        id: this.appointmentService.createId(),
        date: new Date(this.appointmentForm.value.date).toISOString()
      };
      this.appointmentService.createAppointment(appointment).then(() => this.closeModal());
    }
  }

  manualSearch() {
    console.log('[manualSearch] Clicked search button');
    console.log('[manualSearch] Value of manualSearchInput:', this.manualSearchInput);
  
    const value = this.manualSearchInput?.trim();
  
    if (value) {
      console.log('[manualSearch] Trimmed value is valid, proceeding to search...');
      this.searching = true;
  
      this.patientService.getPatientByPersonalNumber(value).subscribe(patient => {
        this.searching = false;
        this.patientFound = !!patient;
      
        if (patient) {
          this.appointmentForm.controls['patientId'].setValue(patient.id);
        } else {
          this.appointmentForm.controls['patientId'].reset();
        }
      
        this.cdr.markForCheck();
      });
      
    } else {
      console.log('[manualSearch] Input is empty or invalid, resetting search results.');
      this.patientFound = null;
      this.appointmentForm.controls['patientId'].reset();
    }
  }
  
  
}
