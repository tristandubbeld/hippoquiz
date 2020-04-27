import React from 'react';
import { Text } from '@chakra-ui/core';

import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';

export const Dashboard = () => {
  const { rounds } = useRounds();

  return (
    <div>
      <Text as="h1" fontSize="2xl">
        Dashboard
      </Text>
      <Text as="h2" fontSize="xl">
        Rounds
      </Text>
      <RoundList rounds={rounds} />
    </div>
  );
};
