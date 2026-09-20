export interface Lesson {
  _id: string;
  title: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number;
  order: number;
}

export interface CourseModule {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string | null;
  createdBy: string;
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSummary {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string | null;
  createdAt: string;
}

export interface CoursePayload {
  title: string;
  description: string;
  category: string;
  thumbnail?: File | null;
}

export interface ModulePayload {
  title: string;
  order: number;
}

export interface LessonPayload {
  title: string;
  order: number;
  duration?: number;
  video?: File | null;
  pdf?: File | null;
}
