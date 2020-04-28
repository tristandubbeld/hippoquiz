import React from 'react';
import { Spinner } from '@chakra-ui/core';
import { CollectionReference } from '@firebase/firestore-types';

import { useFirestore, useCollectionDataOnce } from '../context/firebaseContext';

import { Question } from './Question';

import { Question as QuestionInterface } from '../types/question';
import { Collection } from '../types/collections';
import { useQuestions } from '../context/roundsContext';

interface QuestionListProps {
  roundId: string;
  isClosed?: boolean;
}

export const QuestionList = ({ roundId, isClosed = false }: QuestionListProps) => {
  const db = useFirestore();
  const { questions, updateQuestions } = useQuestions(roundId);

  const questionsRef = db
    .collection(Collection.ROUNDS)
    .doc(roundId)
    .collection(Collection.QUESTIONS) as CollectionReference<QuestionInterface>;

  const { loading: questionsLoading, getCollectionData } = useCollectionDataOnce<QuestionInterface>(
    questionsRef,
  );

  React.useEffect(() => {
    const fetchQuestions = async () => {
      await getCollectionData().then(newQuestions => {
        updateQuestions(roundId, newQuestions);
      });
    };

    if (!questions) {
      fetchQuestions();
    }
  }, [questions]);

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
