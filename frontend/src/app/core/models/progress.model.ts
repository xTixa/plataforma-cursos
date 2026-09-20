import { CourseSummary } from './course.model';

export interface Progress {
  _id?: string;
  student: string;
  course: string;
  completedLessons: string[];
  percentage: number;
}

export interface MyProgressEntry {
  _id: string;
  course: CourseSummary;
  completedLessons: string[];
  percentage: number;
}
