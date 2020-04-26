import { Question } from './question';

export interface Round {
  id: string;
  name?: string;
  questions: Question[];
  isClosed?: boolean;
}
