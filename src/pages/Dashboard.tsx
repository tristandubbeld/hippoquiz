import React from 'react';
import { Text, Spinner, Box, Button } from '@chakra-ui/core';

import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';
import { useCollectionDataOnce, useAddDocument } from '../context/firebaseContext';

import { roundsRef } from '../utils/references';

import { Round, RoundInput } from '../types/round';

export const Dashboard = () => {
  const { rounds, updateRounds, addRound } = useRounds();
  const { data: initialRounds, loading: roundsLoading } = useCollectionDataOnce<Round>(roundsRef);
  const { loading: addLoading, addDocument } = useAddDocument<RoundInput>(roundsRef);

  React.useEffect(() => {
    if (rounds.length === 0 && initialRounds) {
      updateRounds(initialRounds);
    }
  }, [rounds, initialRounds, updateRounds]);

  const handleAddRound = () => {
    addDocument({})
      .then(roundId => {
        addRound({ id: roundId });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <Text as="h1" fontSize="2xl">
        Dashboard
      </Text>
      <Text as="h2" fontSize="xl">
        Rounds
      </Text>
      {roundsLoading ? <Spinner /> : <RoundList rounds={rounds} />}

      <Box height={4} />

      <Button
        onClick={handleAddRound}
        isLoading={addLoading}
        variantColor="black"
        variant="outline"
        size="lg"
        leftIcon="small-add"
        isFullWidth>
        Toevoegen
      </Button>
    </div>
  );
};
