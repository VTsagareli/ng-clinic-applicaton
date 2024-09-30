export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    type: 'checkup' | 'extensive' | 'operation';  // 30 mins, 1 hr, 2 hrs
    date: Date;
    status: 'scheduled' | 'cancelled' | 'completed';
    insuranceNumber?: string;  // only required when appointment is confirmed
    firstName?: string;
    lastName?: string;
  }
  