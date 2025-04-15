import { Patient } from './patient.model';
import { Doctor } from './doctor.model';

export interface Appointment {
  id: string;
  patientId: string;
  Doctor: string; // doctor ID (stored in Firestore)
  type: string;
  date: string; // ISO format
  status?: string;

  // Optional populated references
  Patient?: Patient;
  DoctorObject?: Doctor;
}
