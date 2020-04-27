import React from 'react';
import {
  Select,
  Button,
  Box,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  Flex,
  FormHelperText,
  Stack,
} from '@chakra-ui/core';
import { useParams } from 'react-router-dom';

import { useQuestions, useRounds } from '../context/roundsContext';
import { RouterButton } from '../components/RouterButton';
import { Card } from '../components/Card';

import { QuestionInput } from '../types/question';
import { useFirestore, useCollectionOnce } from '../context/firebaseContext';

export const RoundQuestions = () => {
  const { roundNumber } = useParams();
  const { rounds } = useRounds();
  const { addQuestion, removeQuestion } = useQuestions();
  const db = useFirestore();

  const tempRoundId = '9SflvV4BfmrWYvi6tJT9';
  // const questionsRef = db.collection('rounds').doc(tempRoundId).collection('questions');
  const questionsRef = db.collection(`rounds/${tempRoundId}/questions`);
  const { data, loading } = useCollectionOnce(questionsRef);

  console.log('loading in questions', loading);
  console.log('data in questions', data);

  const [newQuestion, setNewQuestion] = React.useState<QuestionInput>({ type: 'text' });

  const currentRound = rounds[Number(roundNumber) - 1];
  const questions = currentRound.questions;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'text' | 'select';

    setNewQuestion(question => {
      return {
        ...question,
        type,
      };
    });
  };

  const handleAddQuestion = () => {
    // first firebase stuff, get ID back

    // temporary Id
    const tempId = questions.length + 1;

    addQuestion(currentRound.id, { id: `${tempId}`, ...newQuestion });

    // re-initialize newQuestion
    setNewQuestion({ type: 'text' });
  };

  const handleRemoveQuestion = (questionId: string) => {
    removeQuestion(currentRound.id, questionId);
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
        Vragen toevoegen of verwijderen
      </Text>

      <FormHelperText>
        Deze ronde heeft {questions.length} {questions.length === 1 ? 'vraag' : 'vragen'}. Voeg een
        nieuwe vraag toe, of bewerk een bestaande vraag.
      </FormHelperText>

      <Box height={8} />

      {questions.map((question, index) => {
        return (
          <Box pb={4}>
            <Card key={question.id} isSmall borderColor="gray.200">
              <Flex align="center" justify="space-between">
                <Text fontSize="xl" fontWeight="700">
                  Vraag {index + 1}
                </Text>
                <IconButton
                  onClick={() => handleRemoveQuestion(question.id)}
                  aria-label="Vraag verwijderen"
                  icon="delete"
                  variant="ghost"
                />
              </Flex>
              <Box height={4} />
              <FormControl>
                <FormLabel>Type vraag</FormLabel>
                <Select onChange={handleTypeChange} value={question.type}>
                  <option value="text">Tekstveld</option>
                  <option value="select">Meerkeuze</option>
                </Select>
              </FormControl>
              {question.type === 'select' && (
                <Box pt={4}>
                  <FormLabel>Hoeveel keuzes?</FormLabel>
                  <Stack align="center" isInline>
                    <Flex
                      align="center"
                      flexGrow={1}
                      height={10}
                      px={4}
                      border="1px"
                      borderRadius="md"
                      borderColor="gray.200">
                      6
                    </Flex>
                    <IconButton aria-label="minder" icon="minus" />
                    <IconButton aria-label="meer" icon="add" />
                  </Stack>
                </Box>
              )}
            </Card>
          </Box>
        );
      })}

      {newQuestion && (
        <Card isSmall borderColor="gray.200">
          <Flex align="center" height={10}>
            <Text fontSize="xl" fontWeight="700">
              Nieuwe vraag
            </Text>
          </Flex>
          <FormHelperText>
            Deze vraag wordt pas opgeslagen zodra je op de vraag toevoegen knop klikt.
          </FormHelperText>
          <Box height={4} />
          <FormControl>
            <FormLabel>Type vraag</FormLabel>
            <Select onChange={handleTypeChange} value={newQuestion.type}>
              <option value="text">Tekstveld</option>
              <option value="select">Meerkeuze</option>
            </Select>
          </FormControl>

          {newQuestion.type === 'select' && (
            <Box pt={4}>
              <FormLabel>Hoeveel keuzes?</FormLabel>
              <Stack align="center" isInline>
                <Flex
                  align="center"
                  flexGrow={1}
                  height={10}
                  px={4}
                  border="1px"
                  borderRadius="md"
                  borderColor="gray.200">
                  6
                </Flex>
                <IconButton aria-label="minder" icon="minus" />
                <IconButton aria-label="meer" icon="add" />
              </Stack>
              <FormHelperText>
                Maximaal 8 antwoorden mogelijk. Antwoorden worden getoond als A tot en met H.
              </FormHelperText>
            </Box>
          )}

          <Box height={4} />

          <Button variantColor="purple" onClick={handleAddQuestion} isFullWidth>
            Vraag toevoegen
          </Button>
        </Card>
      )}
    </div>
  );
};
