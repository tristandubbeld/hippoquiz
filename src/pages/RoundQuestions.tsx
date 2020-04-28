import React from 'react';
import { Box, Text, FormHelperText } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';

import { RouterButton } from '../components/RouterButton';
import { QuestionsConfigurator } from '../components/QuestionsConfigurator';

export const RoundQuestions = () => {
  const { roundId } = useParams();

  if (!roundId) {
    return <div>404</div>;
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
