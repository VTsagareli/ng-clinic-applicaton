export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    insuranceNumber?: string;
    appointments: string[];  // list of appointment IDs
  }
  