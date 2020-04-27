import React from 'react';
import { Box, Text, FormHelperText, Spinner } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';

import { useRounds } from '../context/roundsContext';
import { useCollectionDataOnce } from '../context/firebaseContext';

import { RouterButton } from '../components/RouterButton';
import { QuestionsConfigurator } from '../components/QuestionsConfigurator';

import { roundsRef } from '../utils/references';
import { Round } from '../types/round';

export const RoundQuestions = () => {
  const { roundId } = useParams();
  const { rounds, updateRounds } = useRounds();
  const { data: initialRounds, loading: roundsLoading } = useCollectionDataOnce<Round>(roundsRef);

  React.useEffect(() => {
    if (rounds.length === 0 && initialRounds) {
      updateRounds(initialRounds);
    }
  }, [rounds, initialRounds, updateRounds]);

  const currentRound = rounds.find(round => round.id === roundId);

  if (!roundId) {
    return <div>404</div>;
  }

  if (!roundsLoading && !currentRound) {
    return <div>This round does not exist</div>;
  }

  if (roundsLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <RouterButton
        to={`/quiz/dashboard/round/${roundId}`}
        leftIcon="arrow-back"
        variant="link"
        color="purple.400">
        Instellingen
      </RouterButton>

      <Box height={4} />

      <Text as="h1" fontSize="2xl">
        Vragen toevoegen of verwijderen
      </Text>

      <FormHelperText>Voeg een nieuwe vraag toe, of bewerk een bestaande vraag.</FormHelperText>

      <Box height={8} />

      <QuestionsConfigurator roundId={roundId} />
    </div>
  );
};
