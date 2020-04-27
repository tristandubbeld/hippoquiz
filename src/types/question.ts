export interface Question {
  id: string;
  title?: string;
  type: 'text' | 'select';
  isAnswered?: boolean; // todo: remove and move to Answer
}

export interface QuestionInput {
  title?: string;
  type: 'text' | 'select';
}
