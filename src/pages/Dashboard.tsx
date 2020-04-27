import React from 'react';
import { Text, Spinner, Box, Button, FormHelperText, Badge } from '@chakra-ui/core';

import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';
import { useCollectionDataOnce, useAddDocument } from '../context/firebaseContext';

import { roundsRef, userRef } from '../utils/references';

import { Round, RoundInput } from '../types/round';
import { User } from '../types/user';
import { RouterButton } from '../components/RouterButton';

export const Dashboard = () => {
  const { rounds, updateRounds, addRound } = useRounds();
  const { data: initialRounds, loading: roundsLoading } = useCollectionDataOnce<Round>(roundsRef);
  const { data: initialUsers, loading: usersLoading } = useCollectionDataOnce<User>(userRef);
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
        Welkom{' '}
        <Text fontWeight="700" as="span" color="purple.900">
          quizmaster
        </Text>
        !
      </Text>

      <FormHelperText>
        Dit is een overzicht van jouw rondes. Voeg nieuwe rondes toe of bewerk bestaande rondes.
      </FormHelperText>

      <Box height={8} />

      {roundsLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <RoundList rounds={rounds} />

          <Box height={2} />

          <Button
            onClick={handleAddRound}
            isLoading={addLoading}
            variantColor="purple"
            // variant="outline"
            size="lg"
            leftIcon="small-add"
            isFullWidth>
            Toevoegen
          </Button>
        </React.Fragment>
      )}

      <Box height={8} />

      <Text as="h2" fontSize="xl" fontWeight="700" color="purple.900">
        Kandidaten &amp; scorebord
      </Text>

      <Box height={4} />

      {usersLoading ? (
        <Spinner />
      ) : initialUsers ? (
        initialUsers.map(user => {
          return (
            <Badge key={user.id} variantColor="purple" fontSize={14} mr={2} mb={2}>
              {user.name}
            </Badge>
          );
        })
      ) : (
        <div>No users found</div>
      )}

      <Box height={4} />

      <RouterButton to="/quiz/scoreboard" variantColor="purple" isFullWidth>
        Check hier het scorebord
      </RouterButton>
    </div>
  );
};
