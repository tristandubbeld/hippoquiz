import React from 'react';
import { Box, FormControl, FormLabel, Flex, Input, IconButton } from '@chakra-ui/core';

import { Question as QuestionInterface } from '../App';

interface QuestionProps {
  question: QuestionInterface;
  index: number;
  isDisabled?: boolean;
}

export const Question = ({ question, index, isDisabled }: QuestionProps) => {
  const answer = React.useRef<HTMLInputElement>(null);

  return (
    <Box mb={4}>
      <FormControl isDisabled={isDisabled}>
        <FormLabel htmlFor={`answer_${question.id}`}>Vraag {index + 1}</FormLabel>
        <Flex>
          <Input id={`answer_${question.id}`} type="text" ref={answer} />

          <IconButton
            variantColor={question.isAnswered ? 'green' : 'purple'}
            aria-label="Verzenden"
            // TODO: Send icon?
            icon={question.isAnswered ? 'check' : 'arrow-right'}
            ml={2}
            isDisabled={isDisabled}
            onClick={() => {
              if (answer.current) {
                alert(answer.current.value);
              }
            }}
          />
        </Flex>
      </FormControl>
    </Box>
  );
};
