import React from 'react';
import { Text } from '@chakra-ui/core';

import { RoundList } from '../components/RoundList';

import { Round } from '../types/round';

interface DashboardProps {
  rounds: Round[];
}

export const Dashboard = ({ rounds }: DashboardProps) => {
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
