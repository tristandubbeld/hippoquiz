import React from 'react';
import { useParams } from 'react-router-dom';
import { Text, Box } from '@chakra-ui/core';

import { useRounds } from '../context/roundsContext';

import { RouterButton } from '../components/RouterButton';
import { QuestionList } from '../components/QuestionList';

export const RoundAnswers = () => {
  const { roundId } = useParams();
  const { rounds } = useRounds();
  const currentRound = rounds?.find(round => round.id === roundId);
  const roundNumber = rounds ? rounds.findIndex(round => round.id === roundId) + 1 : '?';

  if (!roundId) {
    return <div>There is no round id for some reason</div>;
  }

  return (
    <div>
      <RouterButton to="/quiz" leftIcon="arrow-back" variant="link" color="purple.400">
        Overzicht
      </RouterButton>

      <Box height={4} />

      <Text fontSize="2xl" as="h1">
        Ronde {roundNumber}
      </Text>

      <Box height={4} />

      <Text>
        Vul hier je antwoorden in voor ronde {roundNumber}. Als je een antwoord goed denkt te hebben
        kun je deze verzenden door op de paarse knop te drukken*.
      </Text>

      <Box height={8} />

      <QuestionList roundId={roundId} isClosed={currentRound?.isClosed} />

      <Box height={4} />

      <Text>
        *) Wanneer je een antwoord verzonden hebt, kun je het eventueel nog veranderen tot de ronde
        gesloten is.
      </Text>
    </div>
  );
};
