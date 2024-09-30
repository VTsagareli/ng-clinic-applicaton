import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { map, Observable } from 'rxjs';
import { Doctor } from '../../../core/models/doctor.model';

@Component({
  standalone: true,
  selector: 'app-doctor-detail',
  imports: [CommonModule],
  template: `
    <div *ngIf="doctor$ | async as doctor; else loading">
      <ng-container *ngIf="doctor; else notFound">
        <h2>Doctor Details</h2>
        <p>Name: {{ doctor.name }}</p>
        <p>Specialization: {{ doctor.specialization }}</p>
        <button (click)="deleteDoctor(doctor.id)">Delete Doctor</button>
      </ng-container>
    </div>

    <ng-template #loading>
      <p>Loading doctor details...</p>
    </ng-template>
    
    <ng-template #notFound>
      <p>Doctor not found. Please check the doctor ID or try again later.</p>
    </ng-template>
  `
})
export class DoctorDetailComponent implements OnInit {
  doctor$: Observable<Doctor | undefined> | undefined;

  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.doctor$ = this.doctorService.getDoctorById(id).pipe(
      map(doctor => doctor || undefined) // Ensure the value can be undefined
    );
  }

  deleteDoctor(id: string) {
    this.doctorService.deleteDoctor(id).then(() => {
      console.log('Doctor Deleted');
    });
  }
}
