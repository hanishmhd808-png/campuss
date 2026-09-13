export type Category = "Arts" | "Sports" | "Festivals";
export type EventType = "Individual" | "Group";

export interface ProgramEvent {
  id: string;
  title: string;
  category: Category;
  type: EventType;
  date: string;
  description: string;
}

export interface StudentProfile {
  uid: string;
  name: string;
  registerNumber: string;
  className: string;
  role: "student";
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  registerNumber?: string;
  className?: string;
  groupId?: string; 
}

export interface Group {
  id: string;
  eventId: string;
  name: string;
  members: string[]; // array of studentIds
}
