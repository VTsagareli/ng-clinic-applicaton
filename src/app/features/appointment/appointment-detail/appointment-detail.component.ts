import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { map, Observable } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  standalone: true,
  selector: 'app-appointment-detail',
  imports: [CommonModule],
  template: `
    <div *ngIf="appointment$ | async as appointment; else loading">
      <ng-container *ngIf="appointment; else notFound">
        <h2>Appointment Details</h2>
        <p>Type: {{ appointment.type }}</p>
        <p>Date: {{ appointment.date | date: 'short' }}</p>
        <p>Status: {{ appointment.status }}</p>
        <button (click)="cancelAppointment(appointment.id)">Cancel Appointment</button>
      </ng-container>
    </div>

    <ng-template #loading>
      <p>Loading appointment details...</p>
    </ng-template>
    
    <ng-template #notFound>
      <p>Appointment not found. Please check the appointment ID or try again later.</p>
    </ng-template>
  `
})
export class AppointmentDetailComponent implements OnInit {
  appointment$: Observable<Appointment> | undefined;

  constructor(private route: ActivatedRoute, private appointmentService: AppointmentService) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    // Check if id is not null or undefined
    if (id) {
      this.appointment$ = this.appointmentService.getAppointmentById(id).pipe(
        map(appointment => {
          if (!appointment) {
            throw new Error('Appointment not found');
          }
          return appointment;
        })
      );
    } else {
      // Handle the case where id is null or undefined
      this.appointment$ = new Observable<Appointment>(observer => {
        observer.error(new Error('Invalid appointment ID'));
      });
    }
  }
  

  cancelAppointment(id: string) {
    this.appointmentService.deleteAppointment(id).then(() => {
      console.log('Appointment Cancelled');
    });
  }
}
