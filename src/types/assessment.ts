"use client"

export interface MarkingCriterion {
  criterion: string;
  availableMarks: number;
  assignedMarks: number;
}

export interface MarkingPoint {
  id: string;
  description: string;
  marks: number;
  marks_awarded?: number;
  feedback?: string;
  required: string[];
  scope?: string;
}

export interface Feedback {
  marks: number;
  feedback: string;
  markingCriteria: MarkingCriterion[];
  marking_points?: MarkingPoint[];
}

interface QuestionImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Question {
  id: string | number
  text: string
  image?: QuestionImage  // Optional image property
  difficulty: string
  marks: number
  systemPrompt: string
  initialCode: string
  markingPoints: MarkingPoint[]
  prompt: string
} 