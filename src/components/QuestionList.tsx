import React from 'react';
import { Spinner } from '@chakra-ui/core';
import { CollectionReference } from '@firebase/firestore-types';

import { useFirestore, useCollectionDataOnce } from '../context/firebaseContext';

import { Question } from './Question';

import { Question as QuestionInterface } from '../types/question';
import { Collection } from '../types/collections';

interface QuestionListProps {
  roundId: string;
  isClosed?: boolean;
}

export const QuestionList = ({ roundId, isClosed = false }: QuestionListProps) => {
  const [questions, setQuestions] = React.useState<QuestionInterface[]>([]);
  const db = useFirestore();

  const questionsRef = db
    .collection(Collection.ROUNDS)
    .doc(roundId)
    .collection(Collection.QUESTIONS) as CollectionReference<QuestionInterface>;

  const { data: initialQuestions, loading: questionsLoading } = useCollectionDataOnce<
    QuestionInterface
  >(questionsRef);

  React.useEffect(() => {
    if (questions.length === 0 && initialQuestions) {
      setQuestions(initialQuestions);
    }
  }, [questions, initialQuestions, setQuestions]);

  if (questionsLoading) {
    return <Spinner />;
  }

  if (!questions || questions.length === 0) {
    return <div>No questions found</div>;
  }

  return (
    <React.Fragment>
      {questions.map((question, index) => {
        return (
          <Question isDisabled={isClosed} key={question.id} question={question} index={index} />
        );
      })}
    </React.Fragment>
  );
};
