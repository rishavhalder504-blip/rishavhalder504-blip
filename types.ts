
export enum QuestionType {
  MCQ = 'MCQ',
  SHORT = 'SHORT',
  LONG = 'LONG'
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Only for MCQs
  answer: string;
  explanation?: string;
}

export interface Chapter {
  id: number;
  title: string;
  topics: string[];
}

export interface GenerationConfig {
  chapterId: number;
  questionTypes: QuestionType[];
  count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizResult {
  chapterTitle: string;
  questions: Question[];
  generatedAt: string;
}
