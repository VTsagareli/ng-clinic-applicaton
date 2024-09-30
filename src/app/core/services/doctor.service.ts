import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { Observable, combineLatest, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { collection, Firestore, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  // Get all doctors
  getDoctors(): Observable<Doctor[]> {
    const doctorsCollection = collection(this.firestore, 'doctors');

    // Use getDocs to fetch the collection data
    return from(getDocs(doctorsCollection)).pipe(
      map(querySnapshot => {
        return querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as Doctor));
      })
    );
  }

  // Get a specific doctor by ID
  getDoctorById(id: string): Observable<Doctor | undefined> {
    const doctorDocRef = doc(this.firestore, `doctors/${id}`);

    // Use getDoc to fetch the document data
    return from(getDoc(doctorDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { ...docSnapshot.data(), id: docSnapshot.id } as Doctor;
        } else {
          return undefined;
        }
      })
    );
  }

    // Get multiple doctors by IDs
  getDoctorsByIds(ids: string[]): Observable<Doctor[]> {
      // Create an array of observables for each doctor ID
      const doctorObservables = ids.map(id => this.getDoctorById(id));
      
      // Combine the observables into one and return the array of doctors
      return combineLatest(doctorObservables).pipe(
        map(doctors => doctors.filter((doctor): doctor is Doctor => doctor !== undefined)) // Filter out undefined
      );
  }

  // Add a new doctor
  createDoctor(doctor: Doctor): Promise<void> {
    const newDoctorRef = doc(this.firestore, `doctors/${doctor.id}`);
    return setDoc(newDoctorRef, { ...doctor, id: newDoctorRef.id });
  }

  // Update a doctor by ID
  updateDoctor(id: string, data: Partial<Doctor>): Promise<void> {
    const doctorDocRef = doc(this.firestore, `doctors/${id}`);
    return updateDoc(doctorDocRef, data);
  }

  // Delete a doctor by ID
  deleteDoctor(id: string): Promise<void> {
    const doctorDoc = doc(this.firestore, `doctors/${id}`);
    return deleteDoc(doctorDoc);
  }
}
