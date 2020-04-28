import React from 'react';

import { Round } from '../types/round';
import { Question } from '../types/question';

interface RoundsState {
  rounds: Round[] | undefined;
  updateRounds: (newRounds: Round[]) => void;
  updateRound: (updatedRound: Round) => void;
  addRound: (newRound: Round) => void;
  removeRound: (roundId: string) => void;
  updateQuestions: (roundId: string, questions: Question[]) => void;
  addQuestion: (roundId: string, question: Question) => void;
  removeQuestion: (roundId: string, questionId: string) => void;
}

const RoundsContext = React.createContext<RoundsState | undefined>(undefined);

export const RoundsProvider: React.FC = ({ children }) => {
  const [rounds, setRounds] = React.useState<Round[] | undefined>();

  const updateRounds = (newRounds: Round[]) => {
    // removes rounds that don't exist in firestore anymore
    // adds rounds that are new in the firestore
    const updatedRounds = newRounds.filter(newRound => {
      // if the round already exists
      const exists = rounds?.find(round => {
        return round.id === newRound.id;
      });

      if (exists) {
        // return the existing round
        return exists;
      }

      // return the new round
      return newRound;
    });

    // update the state
    setRounds(updatedRounds);
  };

  const updateRound = (updatedRound: Round) => {
    // updates round that needs to be updated
    const updatedRounds = rounds?.map(round => {
      // if round that needs to be updated is found
      if (round.id === updatedRound.id) {
        // return updated round
        return updatedRound;
      }

      // return other rounds
      return round;
    });

    // update the state
    setRounds(updatedRounds);
  };

  const addRound = (newRound: Round) => {
    setRounds(rounds => {
      if (rounds) {
        return [...rounds, newRound];
      }

      return [newRound];
    });
  };

  const removeRound = (roundId: string) => {
    const updatedRounds = rounds?.filter(round => {
      return round.id !== roundId;
    });

    setRounds(updatedRounds);
  };

  const updateQuestions = (roundId: string, questions: Question[]) => {
    const updatedRounds = rounds?.map(round => {
      if (round.id === roundId) {
        return {
          ...round,
          questions: questions,
        };
      }

      return round;
    });

    setRounds(updatedRounds);
  };

  const addQuestion = (roundId: string, question: Question) => {
    const updatedRounds = rounds?.map(round => {
      if (round.id === roundId) {
        if (round.questions) {
          return {
            ...round,
            questions: [...round.questions, question],
          };
        }

        return {
          ...round,
          questions: [question],
        };
      }

      return round;
    });

    setRounds(updatedRounds);
  };

  const removeQuestion = (roundId: string, questionId: string) => {
    const updatedRounds = rounds?.map(round => {
      if (round.id === roundId) {
        if (!round.questions) {
          console.log('Tried removing a question that does not exist');

          return round;
        }

        const updatedQuestions = round.questions.filter(question => {
          return question.id !== questionId;
        });

        return {
          ...round,
          questions: updatedQuestions,
        };
      }

      return round;
    });

    setRounds(updatedRounds);
  };

  return (
    <RoundsContext.Provider
      value={{
        rounds,
        updateRounds,
        updateRound,
        addRound,
        removeRound,
        updateQuestions,
        addQuestion,
        removeQuestion,
      }}>
      {children}
    </RoundsContext.Provider>
  );
};

export const useRounds = () => {
  const context = React.useContext<RoundsState | undefined>(RoundsContext);

  if (context === undefined) {
    throw new Error('useRounds must be used within a RoundsProvider');
  }

  return {
    rounds: context.rounds,
    updateRounds: context.updateRounds,
    updateRound: context.updateRound,
    addRound: context.addRound,
    removeRound: context.removeRound,
  };
};

export const useQuestions = (roundId: string) => {
  const context = React.useContext<RoundsState | undefined>(RoundsContext);

  if (context === undefined) {
    throw new Error('useQuestions must be used within a RoundsProvider');
  }

  const currentRound = context.rounds?.find(round => round.id === roundId);
  const questions = currentRound?.questions;

  return {
    questions,
    updateQuestions: context.updateQuestions,
    addQuestion: context.addQuestion,
    removeQuestion: context.removeQuestion,
  };
};
