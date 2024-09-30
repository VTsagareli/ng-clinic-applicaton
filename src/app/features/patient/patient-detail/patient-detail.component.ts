import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { map, Observable } from 'rxjs';
import { Patient } from '../../../core/models/patient.model';

@Component({
  standalone: true,
  selector: 'app-patient-detail',
  imports: [CommonModule],
  template: `
  <div *ngIf="patient$ | async as patient; else loading">
    <ng-container *ngIf="patient; else notFound">
      <h2>Patient Details</h2>
      <p>First Name: {{ patient.firstName }}</p>
      <p>Last Name: {{ patient.lastName }}</p>
      <p>Phone: {{ patient.phoneNumber }}</p>
      <p>Email: {{ patient.email || 'N/A' }}</p>
      <p>Insurance Number: {{ patient.insuranceNumber || 'N/A' }}</p>
      <button (click)="deletePatient(patient.id)">Delete Patient</button>
    </ng-container>
  </div>

  <ng-template #loading>
    <p>Loading patient details...</p>
  </ng-template>
  
  <ng-template #notFound>
    <p>Patient not found. Please check the patient ID or try again later.</p>
  </ng-template>
`
})
export class PatientDetailComponent implements OnInit {
    patient$: Observable<Patient | undefined> | undefined;

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patient$ = this.patientService.getPatients().pipe(
      map(patients => patients.find(patient => patient.id === id))
    );
  }

  deletePatient(id: string) {
    this.patientService.deletePatient(id).then(() => {
      console.log('Patient Deleted');
    });
  }
}
