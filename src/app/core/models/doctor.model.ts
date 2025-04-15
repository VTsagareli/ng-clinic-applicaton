export interface Availability {
  dayOfWeek: number;  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string;  // e.g., '09:00'
  endTime: string;    // e.g., '17:00'
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: Availability[];
}
