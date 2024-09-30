import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  standalone: true,
  selector: 'app-doctor-create',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Doctor Name" required>
      <input formControlName="specialization" placeholder="Specialization" required>
      <button type="submit" [disabled]="doctorForm.invalid">Create Doctor</button>
    </form>
  `
})
export class DoctorCreateComponent {
  doctorForm: FormGroup;

  constructor(private fb: FormBuilder, private doctorService: DoctorService) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.doctorService.createDoctor(this.doctorForm.value).then(() => {
        console.log('Doctor Created');
        // Optionally, reset the form after submission
        this.doctorForm.reset();
      }).catch(error => {
        console.error('Error creating doctor:', error);
      });
    }
  }
}
