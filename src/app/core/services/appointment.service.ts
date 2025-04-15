import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { from, map, Observable, BehaviorSubject } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { FirebaseService } from './firebase.service';
import { PatientService } from './patient.service';
import { DoctorService } from './doctor.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private firestore: Firestore;
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor(
    private firebaseService: FirebaseService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {
    this.firestore = this.firebaseService.getFirestoreInstance();
    this.listenToAppointments();
  }

  private listenToAppointments(): void {
    const appointmentsCollection = collection(this.firestore, 'appointments');

    onSnapshot(appointmentsCollection, async (querySnapshot) => {
      const appointments: Appointment[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data() as Appointment;
        data.id = docSnap.id;

        // Attach Patient
        const patient = await this.patientService.getPatientById(data.patientId).toPromise();
        if (patient) {
          data.Patient = patient;
        }

        // Attach Doctor
        const doctor = await this.doctorService.getDoctorById(data.Doctor).toPromise();
        if (doctor) {
          data.DoctorObject = doctor;
        }

        appointments.push(data);
      }

      this.appointmentsSubject.next(appointments);
    });
  }

  getAppointmentsWithDetails(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  createId(): string {
    return doc(collection(this.firestore, 'appointments')).id;
  }

  createAppointment(appointment: Appointment): Promise<void> {
    const ref = doc(this.firestore, `appointments/${appointment.id}`);
    return setDoc(ref, appointment);
  }

  getAppointmentById(id: string): Observable<Appointment | undefined> {
    const ref = doc(this.firestore, `appointments/${id}`);
    return from(getDoc(ref)).pipe(
      map(snapshot => {
        if (!snapshot.exists()) return undefined;
        return { ...snapshot.data(), id: snapshot.id } as Appointment;
      })
    );
  }

  updateAppointment(id: string, data: Partial<Appointment>): Promise<void> {
    const ref = doc(this.firestore, `appointments/${id}`);
    return updateDoc(ref, data);
  }

  deleteAppointment(id: string): Promise<void> {
    const ref = doc(this.firestore, `appointments/${id}`);
    return deleteDoc(ref);
  }
}
