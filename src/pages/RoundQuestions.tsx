import React from 'react';
import { Select, Button, Box, Text, Stack, IconButton } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';

import { useQuestions, useRounds } from '../context/roundsContext';
import { RouterButton } from '../components/RouterButton';

export const RoundQuestions = () => {
  const { roundNumber } = useParams();
  const { rounds } = useRounds();
  const { addQuestion } = useQuestions();
  const [newQuestion, setNewQuestion] = React.useState({ type: 'text' });

  const currentRound = rounds[Number(roundNumber) - 1];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;

    setNewQuestion(question => {
      return {
        ...question,
        type,
      };
    });
  };

  const handleAddQuestion = () => {
    // first firebase stuff, get ID back

    addQuestion(currentRound.id, {
      id: 'randomId',
      type: 'text',
    });
  };

  const handleSaveQuestion = () => {
    // add question
    // then
    // redirect to round settings
  };

  return (
    <div>
      <RouterButton
        to={`/quiz/dashboard/round/${roundNumber}`}
        leftIcon="arrow-back"
        variant="link"
        color="purple.400">
        Instellingen
      </RouterButton>

      <Box height={4} />

      <Text as="h1" fontSize="2xl">
        Ronde {roundNumber}
      </Text>

      <Box height={4} />

      <Text>Voeg vragen toe of wijzig het type vragen.</Text>

      <Box height={4} />

      {currentRound.questions.map(question => {
        return (
          <div key={question.id}>
            Type
            <Select onChange={handleTypeChange}>
              <option value="text">Text</option>
              <option value="select">Select</option>
            </Select>
          </div>
        );
      })}

      {newQuestion && (
        <div>
          Type
          <Select onChange={handleTypeChange}>
            <option value="text">Text</option>
            <option value="select">Select</option>
          </Select>
          {newQuestion.type === 'select' && (
            <div>
              <div>options</div>
            </div>
          )}
        </div>
      )}

      <Box height={8} />

      <Stack isInline spacing={2}>
        <Button onClick={handleSaveQuestion}>Opslaan</Button>
        <Button flexGrow={1} variantColor="purple" onClick={handleAddQuestion}>
          Toevoegen
        </Button>
      </Stack>
    </div>
  );
};
