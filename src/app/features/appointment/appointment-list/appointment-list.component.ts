import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarEvent,
  CalendarModule,
  CalendarCommonModule
} from 'angular-calendar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { AppointmentCreateComponent } from '../appointment-create/appointment-create.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarCommonModule,
    CalendarModule,
    MatProgressSpinnerModule,
    AppointmentCreateComponent
  ],
  styleUrls: ['./appointment-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="loaded; else loading">
      <div class="calendar-wrapper">
        <div class="calendar-header-row">
          <button class="add-button" (click)="openModal()">Add New +</button>
        </div>

        <div class="filter-controls">
          <label for="filter">Filter by type:</label>
          <select [(ngModel)]="selectedType" (change)="filterEvents()" id="filter">
            <option value="">All</option>
            <option *ngFor="let type of appointmentTypes" [value]="type">{{ type }}</option>
          </select>
        </div>

        <div class="calendar-controls">
          <button (click)="prev()">‹</button>
          <span class="current-date">{{ viewDate | date: 'longDate' }}</span>
          <button (click)="next()">›</button>
        </div>

        <mwl-calendar-week-view
          [viewDate]="viewDate"
          [events]="filteredEvents"
          [refresh]="refresh"
          [hourSegments]="2"
          [dayStartHour]="9"
          [dayEndHour]="19"
          [locale]="'en-GB'"
        ></mwl-calendar-week-view>
      </div>

      <app-appointment-create
        [showModal]="showModal"
        (closeModalEvent)="closeModal()"
      ></app-appointment-create>
    </ng-container>

    <ng-template #loading>
      <div class="loading-spinner-container">
        <mat-spinner></mat-spinner>
        <p>Loading appointments...</p>
      </div>
    </ng-template>
  `
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  viewDate: Date = new Date();
  allEvents: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  refresh: Subject<void> = new Subject<void>();
  showModal = false;
  loaded = false;

  selectedType: string = '';
  appointmentTypes: string[] = ['First Consultation', 'Follow Up', 'Extensive', 'Operation'];

  private destroy$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointmentsAndAvailability();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAppointmentsAndAvailability(): void {
    this.loaded = false;

    combineLatest([
      this.appointmentService.getAppointmentsWithDetails(),
      this.doctorService.getDoctors()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([appointments, doctors]) => {
        const appointmentEvents: CalendarEvent[] = appointments
          .filter(a => !!a.date)
          .map(a => {
            const start = new Date(a.date);
            const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 mins default
            return {
              start,
              end,
              title: `${this.getTypeInitials(a.type)} - ${this.getLastName(a.Patient?.lastName || 'Unknown')}`,
              color: { primary: '#f44336', secondary: '#ffcdd2' },
              allDay: false,
              cssClass: 'appointment-slot',
              meta: { type: a.type, doctorId: a.Doctor }
            };
          });

        const availabilityEvents = this.generateSplitAvailabilitySlots(doctors, appointmentEvents);

        this.allEvents = [...availabilityEvents, ...appointmentEvents];
        this.filterEvents();

        this.loaded = true;
        this.refresh.next();
        this.cdr.markForCheck();
        console.log('Appointments with details:', appointments);
      });
  }

  generateSplitAvailabilitySlots(doctors: Doctor[], appointments: CalendarEvent[]): CalendarEvent[] {
    const slots: CalendarEvent[] = [];
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    for (const doctor of doctors) {
      for (const availability of doctor.availability || []) {
        for (let day = 1; day <= 31; day++) {
          const date = new Date(year, month, day);
          if (date.getMonth() !== month || date.getDay() !== Number(availability.dayOfWeek)) continue;

          const [startH, startM] = availability.startTime.split(':').map(Number);
          const [endH, endM] = availability.endTime.split(':').map(Number);

          const availStart = new Date(year, month, day, startH, startM);
          const availEnd = new Date(year, month, day, endH, endM);

          const doctorAppointments = appointments
            .filter(a => a.meta?.doctorId === doctor.id)
            .filter(a => a.start.toDateString() === date.toDateString())
            .sort((a, b) => a.start.getTime() - b.start.getTime());

          let currentStart = new Date(availStart);

          for (const appt of doctorAppointments) {
            if (appt.start && currentStart < appt.start) {
              slots.push({
                start: new Date(currentStart),
                end: new Date(appt.start),
                title: `${this.getSpecializationInitials(doctor.specialization)} - ${this.getLastName(doctor.name)}`,
                color: { primary: '#81c784', secondary: '#e8f5e9' },
                allDay: false,
                meta: { type: doctor.specialization },
                cssClass: 'availability-slot'
              });
            }

            currentStart = appt.end ? new Date(appt.end) : new Date(appt.start.getTime() + 30 * 60 * 1000);
          }

          if (currentStart < availEnd) {
            slots.push({
              start: currentStart,
              end: availEnd,
              title: `${this.getSpecializationInitials(doctor.specialization)} - ${this.getLastName(doctor.name)}`,
              color: { primary: '#81c784', secondary: '#e8f5e9' },
              allDay: false,
              meta: { type: doctor.specialization },
              cssClass: 'availability-slot'
            });
          }
        }
      }
    }

    return slots;
  }

  filterEvents() {
    if (!this.selectedType) {
      this.filteredEvents = this.allEvents;
    } else {
      this.filteredEvents = this.allEvents.filter(e =>
        e.meta?.type === this.selectedType || e.title.includes(this.selectedType)
      );
    }
    this.refresh.next();
  }

  private getTypeInitials(type: string): string {
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }  

  getLastName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1] || fullName;
  }

  getSpecializationInitials(specialization: string): string {
    return specialization
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  next() {
    this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() + 7));
    this.loadAppointmentsAndAvailability();
  }

  prev() {
    this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() - 7));
    this.loadAppointmentsAndAvailability();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
