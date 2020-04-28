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
import { motion, AnimatePresence } from 'framer-motion';

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
  const { questions, addQuestion, updateQuestions, removeQuestion } = useQuestions(roundId);
  const [newQuestion, setNewQuestion] = React.useState<QuestionInput>({ type: 'text', options: 1 });

  const db = useFirestore();

  const questionsRef = db
    .collection(Collection.ROUNDS)
    .doc(roundId)
    .collection(Collection.QUESTIONS) as CollectionReference<Question>;

  const { loading: addLoading, addDocument } = useAddDocument<QuestionInput>(questionsRef);
  const { removingId, removeDocument } = useRemoveDocument(questionsRef);
  const { loading: questionsLoading, getCollectionData } = useCollectionDataOnce<Question>(
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
  }, [questions, getCollectionData, updateQuestions, roundId]);

  const handleTypeChange = () => {
    console.log('handle type change');
  };

  const handleNewQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'text' | 'select';

    if (type === 'text') {
      setNewQuestion(question => {
        return {
          ...question,
          type,
        };
      });
    }

    if (type === 'select') {
      setNewQuestion(question => {
        return {
          ...question,
          type,
          options: 4,
        };
      });
    }
  };

  const handleNewQuestionAmountChange = (operation: 'add' | 'subtract') => {
    if (operation === 'add') {
      setNewQuestion(question => {
        return {
          ...question,
          options: question.options + 1,
        };
      });
    }

    if (operation === 'subtract') {
      setNewQuestion(question => {
        return {
          ...question,
          options: question.options - 1,
        };
      });
    }
  };

  const handleAddQuestion = () => {
    addDocument(newQuestion)
      .then(questionId => {
        addQuestion(roundId, { id: questionId, ...newQuestion });

        // re-initialize newQuestion
        setNewQuestion({ type: 'text', options: 1 });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleRemoveQuestion = (questionId: string) => {
    removeDocument(questionId).then(() => {
      removeQuestion(roundId, questionId);
    });
  };

  if (questionsLoading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <AnimatePresence>
        {questions &&
          questions.map((question, index) => {
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}>
                <Box pb={4}>
                  <Card isSmall borderColor="gray.200">
                    <Flex align="center" justify="space-between">
                      <Text fontSize="lg" fontWeight="700" color="purple.900">
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

                    <Box height={2} />

                    <FormControl>
                      <Select
                        onChange={handleTypeChange}
                        value={question.type}
                        isDisabled={question.id === removingId}>
                        <option value="text">Open vraag</option>
                        <option value="select">Meerkeuze vraag</option>
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
                            {question.options}
                          </Flex>
                          <IconButton aria-label="minder" icon="minus" />
                          <IconButton aria-label="meer" icon="add" />
                        </Stack>
                      </Box>
                    )}
                  </Card>
                </Box>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {newQuestion && (
        <Card isSmall borderColor="gray.200">
          <Flex align="center" height={10}>
            <Text fontSize="lg" fontWeight="700" color="purple.900">
              Nieuwe vraag
            </Text>
          </Flex>
          <FormHelperText>
            Deze vraag wordt pas opgeslagen zodra je op de vraag toevoegen knop klikt.
          </FormHelperText>
          <Box height={4} />
          <FormControl>
            <Select onChange={handleNewQuestionTypeChange} value={newQuestion.type}>
              <option value="text">Open vraag</option>
              <option value="select">Meerkeuze vraag</option>
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
                  {newQuestion.options}
                </Flex>
                <IconButton
                  onClick={() => handleNewQuestionAmountChange('subtract')}
                  isDisabled={newQuestion.options === 2}
                  aria-label="minder"
                  icon="minus"
                />
                <IconButton
                  onClick={() => handleNewQuestionAmountChange('add')}
                  isDisabled={newQuestion.options === 8}
                  aria-label="meer"
                  icon="add"
                />
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
