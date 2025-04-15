import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { Observable, combineLatest, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  collection,
  Firestore,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.getFirestoreInstance();
  }

  getDoctors(): Observable<Doctor[]> {
    const doctorsCollection = collection(this.firestore, 'doctors');
    return from(getDocs(doctorsCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Doctor)))
    );
  }

  getDoctorById(id: string): Observable<Doctor | undefined> {
    const ref = doc(this.firestore, `doctors/${id}`);
    return from(getDoc(ref)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { ...snapshot.data(), id: snapshot.id } as Doctor;
        } else {
          return undefined;
        }
      })
    );
  }

  getDoctorsByIds(ids: string[]): Observable<Doctor[]> {
    const observables = ids.map(id => this.getDoctorById(id));
    return combineLatest(observables).pipe(
      map(doctors => doctors.filter((doc): doc is Doctor => doc !== undefined))
    );
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): Promise<void> {
    const doctorsCollection = collection(this.firestore, 'doctors');
    return addDoc(doctorsCollection, doctor).then(() => {});
  }

  updateDoctor(id: string, data: Partial<Doctor>): Promise<void> {
    const ref = doc(this.firestore, `doctors/${id}`);
    return updateDoc(ref, data);
  }

  deleteDoctor(id: string): Promise<void> {
    const ref = doc(this.firestore, `doctors/${id}`);
    return deleteDoc(ref);
  }
}
