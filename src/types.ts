export type Language = 'uz' | 'en' | 'ru' | 'tr' | 'ar' | 'fr' | 'de' | 'es';

export interface Question {
  id: string;
  number: number;
  question: string;
  formula?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  steps: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface UserSession {
  name: string;
  phone: string;
  token: string;
  codeLabel?: string;
  isDemo?: boolean;
}

export interface AccessCode {
  code: string;
  label: string;
  price: string;
  status: 'active' | 'revoked' | 'expired';
  paymentStatus: 'paid' | 'pending' | 'demo';
  createdAt: string;
  expiresAt: string | null;
  usageCount: number;
}

export interface UserSessionLog {
  id: string;
  name: string;
  phone: string;
  codeUsed: string;
  loginTime: string;
}

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type SubjectType = 'Matematika' | 'Algebra';

export interface SubjectTopics {
  [grade: number]: {
    Matematika?: string[];
    Algebra?: string[];
  };
}
