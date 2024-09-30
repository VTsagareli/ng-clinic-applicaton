import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  standalone: true,
  selector: 'app-patient-create',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./patient-create.component.css'],
  template: `
   <div class="patient-form-container">
     <!-- <h3>Fill Out The Patient Info:</h3> -->
     <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
       <input formControlName="firstName" placeholder="Patient First Name" required>
       <input formControlName="lastName" placeholder="Patient Last Name" required>
       <input formControlName="phoneNumber" placeholder="Phone Number" required>
       <input formControlName="email" placeholder="Email (optional)">
       <input formControlName="insuranceNumber" placeholder="Insurance Number (optional)">
       <button type="submit" [disabled]="patientForm.invalid">Create Patient</button>
     </form>
     <!-- Conditional label to display the patient's ID -->
     <label class="patient-id-label" *ngIf="submissionSuccess">
       Patient Added!
     </label>
   </div>
  `
})
export class PatientCreateComponent {
  @Input() appointmentForm!: FormGroup; // Accept appointmentForm as input

  patientForm: FormGroup;
  submissionSuccess: boolean = false;
  patientId!: string; // Store the ID of the newly created patient

  constructor(private fb: FormBuilder, private patientService: PatientService) {
    this.patientForm = this.fb.group({
      patientId: ['',],  // Keep this field in the form for ID
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      insuranceNumber: [''],
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const patientData: Patient = this.patientForm.value;

      // Check if a patient with the same details already exists
      this.patientService.getPatientsByName(patientData.firstName, patientData.lastName).subscribe(existingPatient => {
        if (existingPatient) {
          // Patient is already registered
          this.submissionSuccess = false; // Mark submission as unsuccessful
          console.log(`User already registered, patientId: ${existingPatient.id}`);
          alert(`User already registered, patientId: ${existingPatient.id}`); // Show alert with user ID

          // Set the existing patient ID in the form
          this.appointmentForm.controls['patientId'].setValue(existingPatient.id);
          this.patientForm.controls['patientId'].setValue(existingPatient.id); // Also set in the patient form
        } else {
          // No existing patient, proceed to create a new one
          this.patientId = this.patientService.createId(); // Generate a new patient ID

          this.patientService.createPatient({ ...patientData, id: this.patientId }).then(() => {
            console.log('Patient Created');
            this.submissionSuccess = true; // Mark submission as successful

            // Set the new patient ID in the form
            this.patientForm.controls['patientId'].setValue(this.patientId);
            this.appointmentForm.controls['patientId'].setValue(this.patientId); // Set ID in appointment form too

            // Optionally reset the patient form if needed
            this.patientForm.reset();
          });
        }
      });
    }
  }
}
