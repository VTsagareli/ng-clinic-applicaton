import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { from, map, switchMap, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { FirebaseService } from './firebase.service';
import { PatientService } from './patient.service';  // Assuming PatientService is properly implemented

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore: Firestore;

  constructor(
    private firebaseService: FirebaseService,
    private patientService: PatientService
  ) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  // Create a unique ID for a new appointment
  createId(): string {
    return doc(collection(this.firestore, 'appointments')).id; // Generate a new document ID
  }

  // Get all appointments
  getAppointments(): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.firestore, 'appointments');

    // Fetch the collection data and map to Appointment array
    return from(getDocs(appointmentsCollection)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Appointment))
      )
    );
  }

  // Get all appointments with patient details (i.e., firstName, lastName)
  getAppointmentsWithPatientDetails(): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.firestore, 'appointments');

    return from(getDocs(appointmentsCollection)).pipe(
      switchMap(querySnapshot => {
        const appointments = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Appointment));

        // Extract unique patient IDs from appointments
        const patientIds = [...new Set(appointments.map(app => app.patientId))];

        // Fetch patient data based on extracted IDs
        return this.patientService.getPatientsByIds(patientIds).pipe(
          map(patients => {
            // Map appointments to include patient details
            return appointments.map(appointment => {
              const patient = patients.find(p => p.id === appointment.patientId);
              return {
                ...appointment,
                firstName: patient ? patient.firstName : '',
                lastName: patient ? patient.lastName : ''
              };
            });
          })
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
