import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentListComponent } from './appointment-list.component';
import { of } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;

  beforeEach(async () => {
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getAppointmentsWithDetails']);

    await TestBed.configureTestingModule({
      imports: [AppointmentListComponent],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner initially', () => {
    mockAppointmentService.getAppointmentsWithDetails.and.returnValue(of([]));
    fixture.detectChanges();
    const loadingSpinner = fixture.nativeElement.querySelector('.loading-spinner-container');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should fetch and display appointments', async () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'p1',
        Doctor: 'd1',
        firstName: 'John',
        lastName: 'Doe',
        type: 'checkup',
        date: '2024-09-30T10:00:00',
        status: "scheduled"
      },
      {
        id: '2',
        patientId: 'p2',
        Doctor: 'd2',
        firstName: 'Jane',
        lastName: 'Smith',
        type: 'operation',
        date: '2024-09-30T11:00:00',
        status: 'scheduled'
      }
    ];

    mockAppointmentService.getAppointmentsWithDetails.and.returnValue(of(mockAppointments));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('John');
    expect(rows[0].textContent).toContain('Doe');
    expect(rows[0].textContent).toContain('checkup');
    expect(rows[1].textContent).toContain('Jane');
    expect(rows[1].textContent).toContain('Smith');
    expect(rows[1].textContent).toContain('operation');
  });

  it('should handle error when fetching appointments', async () => {
    mockAppointmentService.getAppointmentsWithDetails.and.returnValue(of([])); // simulate empty on error
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(rows.length).toBe(0);
  });

  it('should log doctor names on init', async () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'p1',
        Doctor: 'd1',
        firstName: 'John',
        lastName: 'Doe',
        type: 'checkup',
        date: '2024-09-30T10:00:00',
        status: "scheduled"
      }
    ];

    mockAppointmentService.getAppointmentsWithDetails.and.returnValue(of(mockAppointments));

    const consoleSpy = spyOn(console, 'log');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(consoleSpy).toHaveBeenCalledWith('Doctor Names:', ['Dr. Smith']);
  });
});
