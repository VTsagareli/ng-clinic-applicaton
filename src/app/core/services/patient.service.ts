import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { Observable, from, map } from 'rxjs';
import { collection, Firestore, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  // Create a unique ID for a new patient
  createId(): string {
    return doc(collection(this.firestore, 'patients')).id; // Generate an ID using a new document reference
  }

  // Get all patients
  getPatients(): Observable<Patient[]> {
    const patientsCollection = collection(this.firestore, 'patients');

    // Use getDocs to fetch the collection data
    return from(getDocs(patientsCollection)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Patient));
      })
    );
  }

  // Get a specific patient by ID
  getPatientById(id: string): Observable<Patient | undefined> {
    const patientDocRef = doc(this.firestore, `patients/${id}`);

    // Use getDoc to fetch the document data
    return from(getDoc(patientDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { ...docSnapshot.data(), id: docSnapshot.id } as Patient;
        } else {
          return undefined;
        }
      })
    );
  }

  getPatientsByIds(ids: string[]): Observable<Patient[]> {
    const patientsCollection = collection(this.firestore, 'patients');
    
    return from(getDocs(patientsCollection)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as Patient))
          .filter(patient => ids.includes(patient.id)); // Filter based on input IDs
      })
    );
  }

  // Add a new patient
  createPatient(patient: Patient): Promise<void> {
    const newPatientRef = doc(this.firestore, `patients/${patient.id}`);
    return setDoc(newPatientRef, patient);
  }

  // Update a patient by ID
  updatePatient(id: string, data: Partial<Patient>): Promise<void> {
    const patientDocRef = doc(this.firestore, `patients/${id}`);
    return updateDoc(patientDocRef, data);
  }

  // Delete a patient by ID
  deletePatient(id: string): Promise<void> {
    const patientDoc = doc(this.firestore, `patients/${id}`);
    return deleteDoc(patientDoc);
  }

  getPatientsByName(firstName: string, lastName: string): Observable<Patient | undefined> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('firstName', '==', firstName), where('lastName', '==', lastName));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return undefined; // No patient found
        } else {
          const patientDoc = snapshot.docs[0]; // Assuming you want the first match
          return { ...patientDoc.data(), id: patientDoc.id } as Patient; // Return the patient with ID
        }
      })
    );
  }

}
