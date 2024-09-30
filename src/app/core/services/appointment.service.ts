import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { from, map, Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { FirebaseService } from './firebase.service';
import { PatientService } from './patient.service';
import { DoctorService } from './doctor.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore: Firestore;
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]); // Create a BehaviorSubject to hold appointments

  constructor(
    private firebaseService: FirebaseService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  // Create a unique ID for a new appointment
  createId(): string {
    return doc(collection(this.firestore, 'appointments')).id; // Generate a new document ID
  }

  // Get all appointments as an observable
  getAppointments(): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.firestore, 'appointments');

    // Use onSnapshot to listen for real-time updates
    onSnapshot(appointmentsCollection, (querySnapshot) => {
      const appointments = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Appointment));
      this.appointmentsSubject.next(appointments); // Emit the new appointments array
    });

    return this.appointmentsSubject.asObservable(); // Return the observable
  }

// Get all appointments with patient and doctor details
getAppointmentsWithDetails(): Observable<Appointment[]> {
  const appointmentsCollection = collection(this.firestore, 'appointments');

  return from(getDocs(appointmentsCollection)).pipe(
    switchMap(querySnapshot => {
      if (querySnapshot.empty) {
        // Return an empty array if there are no appointments
        return of([]); // Emit an empty array
      }

      const appointments = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Appointment));

      // Extract unique patient and doctor IDs
      const patientIds = [...new Set(appointments.map(app => app.patientId))];
      const doctorIds = [...new Set(appointments.map(app => app.doctorId))];

      // Fetch patient and doctor data
      return this.patientService.getPatientsByIds(patientIds).pipe(
        switchMap(patients => 
          this.doctorService.getDoctorsByIds(doctorIds).pipe(
            map(doctors => {
              console.log('Fetched Doctors:', doctors); // Log fetched doctors for debugging
              return appointments.map(appointment => {
                const patient = patients.find(p => p.id === appointment.patientId);
                const doctor = doctors.find(d => d.id === appointment.doctorId);
                console.log('Appointment:', appointment, 'Patient:', patient, 'Doctor:', doctor); // Log appointment details
                return {
                  ...appointment,
                  firstName: patient ? patient.firstName : '',
                  lastName: patient ? patient.lastName : '',
                  doctorName: doctor ? doctor.name : '' // Assuming doctor has a 'name' property
                };
              });
            })
          )
        )
      );
    })
  );
}


  // Get a specific appointment by ID
  getAppointmentById(id: string): Observable<Appointment | undefined> {
    const appointmentDocRef = doc(this.firestore, `appointments/${id}`);

    return from(getDoc(appointmentDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { ...docSnapshot.data(), id: docSnapshot.id } as Appointment;
        } else {
          return undefined;  // Return undefined if no document exists
        }
      })
    );
  }

  // Add a new appointment
  createAppointment(appointment: Appointment): Promise<void> {
    const newAppointmentRef = doc(this.firestore, `appointments/${appointment.id}`);
    return setDoc(newAppointmentRef, appointment);
  }

  // Update an existing appointment by ID
  updateAppointment(id: string, data: Partial<Appointment>): Promise<void> {
    const appointmentDocRef = doc(this.firestore, `appointments/${id}`);
    return updateDoc(appointmentDocRef, data);
  }

  // Delete an appointment by ID
  deleteAppointment(id: string): Promise<void> {
    const appointmentDocRef = doc(this.firestore, `appointments/${id}`);
    return deleteDoc(appointmentDocRef);
  }
}
