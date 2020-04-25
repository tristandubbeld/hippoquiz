import React from 'react';
import { useParams } from 'react-router-dom';
import { Text, Box } from '@chakra-ui/core';

import { Round } from '../App';
import { Question } from '../components/Question';

interface RoundDetailsProps {
  rounds: Round[];
}

export const RoundDetails = ({ rounds }: RoundDetailsProps) => {
  const { roundNumber } = useParams();
  const currentRound = rounds[Number(roundNumber) - 1];

  return (
    <div>
      <Text fontSize="4xl" fontWeight="700">
        Ronde {roundNumber}
      </Text>
      <Box height={4} />
      <Text>
        Vul hier je antwoorden in voor ronde {roundNumber}. Als je een antwoord goed denkt te hebben
        kun je deze verzenden door op de paarse knop te drukken*.
      </Text>
      <Box height={8} />
      {currentRound &&
        currentRound.questions.map((question, index) => {
          return (
            <Question
              isDisabled={currentRound.isClosed}
              key={question.id}
              question={question}
              index={index}
            />
          );
        })}
      <Box height={4} />
      <Text>
        *) Wanneer je een antwoord verzonden hebt, kun je het eventueel nog veranderen tot de ronde
        gesloten is.
      </Text>
    </div>
  );
};
