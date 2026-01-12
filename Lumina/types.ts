
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE'
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  progress: number;
  category: string;
  image: string;
  enrolled?: boolean;
  lessons?: Lesson[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  branch?: string;
  className?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  type: 'MCQ' | 'PROJECT' | 'CODING' | 'ESSAY';
  dueDate: string;
  totalMarks: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  studentId: string;
  courseName: string;
  assessmentTitle: string;
  score: number;
  totalMarks: number;
  date: string;
  status: 'EXCELLENT' | 'GOOD' | 'PASS' | 'FAIL';
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}
