import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { Observable, from, map } from 'rxjs';
import {
  collection,
  Firestore,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  /**
   * Generate a new Firestore auto-ID for patient creation.
   */
  createId(): string {
    return doc(collection(this.firestore, 'patients')).id;
  }

  /**
   * Create a new patient in Firestore using a generated ID.
   */
  createPatient(patient: Patient): Promise<void> {
    const newPatientRef = doc(this.firestore, `patients/${patient.id}`);
    return setDoc(newPatientRef, patient);
  }

  /**
   * Get a single patient by Firestore ID.
   */
  getPatientById(id: string): Observable<Patient | undefined> {
    const patientDocRef = doc(this.firestore, `patients/${id}`);
    return from(getDoc(patientDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { ...docSnapshot.data(), id: docSnapshot.id } as Patient;
        }
        return undefined;
      })
    );
  }

  /**
   * Get all patients in Firestore.
   */
  getPatients(): Observable<Patient[]> {
    const patientsCollection = collection(this.firestore, 'patients');
    return from(getDocs(patientsCollection)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient))
      )
    );
  }

  /**
   * Find patients by first and last name.
   */
  getPatientsByName(firstName: string, lastName: string): Observable<Patient | undefined> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('firstName', '==', firstName), where('lastName', '==', lastName));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) return undefined;
        const docSnap = snapshot.docs[0];
        return { ...docSnap.data(), id: docSnap.id } as Patient;
      })
    );
  }

  /**
   * Query a patient using the stored personal number field.
   */
  getPatientByPersonalNumber(personalNumber: string): Observable<Patient | undefined> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('personalNumber', '==', personalNumber));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) return undefined;
        const docSnap = snapshot.docs[0];
        return { ...docSnap.data(), id: docSnap.id } as Patient;
      })
    );
  }

  /**
   * Retrieve a list of patients by their Firestore IDs.
   */
  getPatientsByIds(ids: string[]): Observable<Patient[]> {
    const patientsCollection = collection(this.firestore, 'patients');
    return from(getDocs(patientsCollection)).pipe(
      map(snapshot =>
        snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as Patient))
          .filter(patient => ids.includes(patient.id))
      )
    );
  }

  /**
   * Update patient fields by Firestore ID.
   */
  updatePatient(id: string, data: Partial<Patient>): Promise<void> {
    const ref = doc(this.firestore, `patients/${id}`);
    return updateDoc(ref, data);
  }

  /**
   * Delete a patient by Firestore ID.
   */
  deletePatient(id: string): Promise<void> {
    const ref = doc(this.firestore, `patients/${id}`);
    return deleteDoc(ref);
  }

  /**
   * Delete all patients — use with caution!
   */
  async deleteAllPatients(): Promise<void> {
    const snapshot = await getDocs(collection(this.firestore, 'patients'));
    const deleteOps = snapshot.docs.map(docSnap =>
      deleteDoc(doc(this.firestore, `patients/${docSnap.id}`))
    );
    await Promise.all(deleteOps);
  }
}
