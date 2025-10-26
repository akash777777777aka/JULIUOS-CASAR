import { QuestionLevel } from "./types";

export const CHARACTERS = [
  "Julius Caesar",
  "Brutus",
  "Mark Antony",
  "Cassius",
  "Portia",
  "Calpurnia",
  "Octavius",
  "Casca"
];

export const ACTS = [1, 2, 3, 4, 5];

export const SCENES_PER_ACT: { [key: number]: number[] } = {
  1: [1, 2, 3],
  2: [1, 2, 3, 4],
  3: [1, 2, 3],
  4: [1, 2, 3],
  5: [1, 2, 3, 4, 5],
};

export const QUESTION_LEVELS: QuestionLevel[] = ['Middle School', 'High School', 'AP / College'];