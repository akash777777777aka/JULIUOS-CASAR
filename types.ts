export enum View {
  MENU,
  ACT_SCENE,
  CHARACTER,
  QUIZ,
  SCORE,
  HISTORY,
  DOUBT_SOLVER,
}

export type QuestionLevel = 'Middle School' | 'High School' | 'AP / College';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuestionAndAnswer {
  question:string;
  answer: string;
}

export interface BaseViewProps {
  setView: (view: View) => void;
}

export interface NavigableViewProps extends BaseViewProps {
  navigateBack: () => void;
}

export interface ViewProps extends NavigableViewProps {
  user: User;
}

export interface User {
  uid: string;
  email: string | null;
}

// History Types
export type HistoryItemType = 'act-scene' | 'character' | 'quiz' | 'doubt-solver';

export interface BaseHistoryItem {
  id: string;
  timestamp: string;
  type: HistoryItemType;
  level: QuestionLevel;
}

export interface ActSceneHistoryItem extends BaseHistoryItem {
  type: 'act-scene';
  act: number;
  scene: number;
  questions: QuestionAndAnswer[];
}

export interface CharacterHistoryItem extends BaseHistoryItem {
  type: 'character';
  character: string;
  questions: QuestionAndAnswer[];
}

export interface QuizHistoryItem extends BaseHistoryItem {
  type: 'quiz';
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface DoubtSolverHistoryItem extends BaseHistoryItem {
  type: 'doubt-solver';
  question: string;
  answer: string;
}

export type HistoryItem = ActSceneHistoryItem | CharacterHistoryItem | QuizHistoryItem | DoubtSolverHistoryItem;