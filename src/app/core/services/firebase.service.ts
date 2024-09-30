import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private analytics: Analytics;

  constructor() {
    // Initialize Firebase app with the environment configuration
    this.app = initializeApp(environment.firebaseConfig);
    
    // Initialize Firestore and Analytics (optional)
    this.firestore = getFirestore(this.app);
    this.analytics = getAnalytics(this.app);
  }

  getFirestoreInstance(): Firestore {
    return this.firestore;
  }

  getAnalyticsInstance(): Analytics {
    return this.analytics;
  }
}
