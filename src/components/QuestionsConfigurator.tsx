import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  FormControl,
  FormLabel,
  Select,
  Stack,
  FormHelperText,
  Button,
  Text,
  Spinner,
} from '@chakra-ui/core';
import { CollectionReference } from '@firebase/firestore-types';

import { useQuestions } from '../context/roundsContext';
import {
  useFirestore,
  useAddDocument,
  useRemoveDocument,
  useCollectionDataOnce,
} from '../context/firebaseContext';

import { Card } from './Card';

import { Collection } from '../types/collections';
import { Question, QuestionInput } from '../types/question';

interface QuestionsConfiguratorProps {
  roundId: string;
}

export const QuestionsConfigurator = ({ roundId }: QuestionsConfiguratorProps) => {
  const { addQuestion /* removeQuestion */ } = useQuestions();
  const [newQuestion, setNewQuestion] = React.useState<QuestionInput>({ type: 'text' });

  const db = useFirestore();

  const questionsRef = db
    .collection(Collection.ROUNDS)
    .doc(roundId)
    .collection(Collection.QUESTIONS) as CollectionReference<Question>;

  const { loading: addLoading, addDocument } = useAddDocument<QuestionInput>(questionsRef);
  const { removingId, removeDocument } = useRemoveDocument(questionsRef);

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const { data: initialQuestions, loading: questionsLoading } = useCollectionDataOnce<Question>(
    questionsRef,
  );

  React.useEffect(() => {
    if (questions.length === 0 && initialQuestions) {
      setQuestions(initialQuestions);
    }
  }, [questions, initialQuestions, setQuestions]);

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
    addDocument(newQuestion)
      .then(questionId => {
        // add question to rounds state
        // TODO: check if we still have to do this
        addQuestion(roundId, { id: questionId, ...newQuestion });

        // add question to component state
        setQuestions(questions => {
          return [...questions, { id: questionId, ...newQuestion }];
        });

        // re-initialize newQuestion
        setNewQuestion({ type: 'text' });
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const handleRemoveQuestion = (questionId: string) => {
    removeDocument(questionId).then(() => {
      setQuestions(questions => {
        const updatedQuestions = questions.filter(question => {
          return question.id !== questionId;
        });

        return updatedQuestions;
      });
    });

    // TODO: check if we still need to do this
    // removeQuestion(roundId, questionId);
  };

  if (questionsLoading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      {questions &&
        questions.map((question, index) => {
          return (
            <Box key={question.id} pb={4}>
              <Card isSmall borderColor="gray.200">
                <Flex align="center" justify="space-between">
                  <Text fontSize="xl" fontWeight="700">
                    Vraag {index + 1}
                  </Text>
                  <IconButton
                    onClick={() => handleRemoveQuestion(question.id)}
                    isLoading={question.id === removingId}
                    aria-label="Vraag verwijderen"
                    icon="delete"
                    variant="ghost"
                  />
                </Flex>
                <Box height={4} />
                <FormControl>
                  <FormLabel>Type vraag</FormLabel>
                  <Select
                    onChange={handleTypeChange}
                    value={question.type}
                    isDisabled={question.id === removingId}>
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

          <Button
            variantColor="purple"
            onClick={handleAddQuestion}
            isFullWidth
            isLoading={addLoading}>
            Vraag toevoegen
          </Button>
        </Card>
      )}
    </React.Fragment>
  );
};
