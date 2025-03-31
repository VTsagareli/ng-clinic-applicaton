import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentListComponent } from './appointment-list.component';
import { of, throwError } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';

describe('AppointmentListComponent', () => {
    let component: AppointmentListComponent;
    let fixture: ComponentFixture<AppointmentListComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AppointmentListComponent] // Use imports instead of declarations
      }).compileComponents();
  
      fixture = TestBed.createComponent(AppointmentListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner initially', () => {
    fixture.detectChanges(); // Trigger initial data binding
    const loadingSpinner = fixture.nativeElement.querySelector('.loading-spinner-container');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should fetch and display appointments', () => {
    const mockAppointments: Appointment[] = [
      {
          id: '1', patientId: 'p1', doctorId: 'd1', firstName: 'John', lastName: 'Doe', type: 'checkup', date: new Date('2024-09-30T10:00:00'),
          doctorName: '',
          status: 'scheduled'
      },
      {
          id: '2', patientId: 'p2', doctorId: 'd2', firstName: 'Jane', lastName: 'Smith', type: 'operation', date: new Date('2024-09-30T11:00:00'),
          doctorName: '',
          status: 'scheduled'
      }
    ];


    fixture.detectChanges(); // Trigger change detection

    // Wait for the data to be fetched
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Update the view with the fetched appointments

      const rows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(rows.length).toBe(2); // Check if two rows are displayed

      expect(rows[0].textContent).toContain('John');
      expect(rows[0].textContent).toContain('Doe');
      expect(rows[0].textContent).toContain('Checkup');
      expect(rows[0].textContent).toContain('30/09/2024'); // Depending on locale, format may vary
      expect(rows[0].textContent).toContain('10:00 AM'); // Adjust based on your timezone and formatting

      expect(rows[1].textContent).toContain('Jane');
      expect(rows[1].textContent).toContain('Smith');
      expect(rows[1].textContent).toContain('Follow-up');
      expect(rows[1].textContent).toContain('30/09/2024');
      expect(rows[1].textContent).toContain('11:00 AM');
    });
  });

  it('should handle error when fetching appointments', () => {

    fixture.detectChanges(); // Trigger change detection

    // Wait for the data to be fetched
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Update the view

      const rows = fixture.nativeElement.querySelectorAll('mat-row');
      expect(rows.length).toBe(0); // Check if no rows are displayed
    });
  });

  it('should log doctor names on init', () => {
    const mockAppointments: Appointment[] = [
      {
          id: '1', patientId: 'p1', doctorId: 'd1', firstName: 'John', lastName: 'Doe', type: 'checkup', date: new Date('2024-09-30T10:00:00'), doctorName: 'Dr. Smith',
          status: 'scheduled'
      },
    ];

    

    const consoleSpy = spyOn(console, 'log');

    fixture.detectChanges(); // Trigger change detection

    expect(consoleSpy).toHaveBeenCalledWith('Doctor Names:', ['Dr. Smith']);
  });
});
