export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    availability: Availability[];
  }
  
  export interface Availability {
    dayOfWeek: number;  // 0 = Sunday, 6 = Saturday
    startTime: string;  // in HH:mm format, e.g., "08:00"
    endTime: string;    // in HH:mm format, e.g., "17:00"
  }
  