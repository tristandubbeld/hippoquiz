import React from 'react';
import { Text, Spinner } from '@chakra-ui/core';

import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';
import { useCollectionDataOnce } from '../context/firebaseContext';

import { roundsRef } from '../utils/references';

import { Round } from '../types/round';

export const Dashboard = () => {
  const { rounds, updateRounds } = useRounds();
  const { data: initialRounds, loading: roundsLoading } = useCollectionDataOnce<Round>(roundsRef);

  React.useEffect(() => {
    if (rounds.length === 0 && initialRounds) {
      updateRounds(initialRounds);
    }
  }, [rounds, initialRounds, updateRounds]);

  return (
    <div>
      <Text as="h1" fontSize="2xl">
        Dashboard
      </Text>
      <Text as="h2" fontSize="xl">
        Rounds
      </Text>
      {roundsLoading ? <Spinner /> : <RoundList rounds={rounds} />}
    </div>
  );
};
