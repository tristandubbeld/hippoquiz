import React from 'react';
import { Text, Spinner, Box, Button, FormHelperText, Badge } from '@chakra-ui/core';

import { useRounds } from '../context/roundsContext';
import { useUsers } from '../context/usersContext';
import { useCollectionDataOnce, useAddDocument } from '../context/firebaseContext';
import { RoundList } from '../components/RoundList';

import { roundsRef, userRef } from '../utils/references';

import { Round, RoundInput } from '../types/round';
import { User } from '../types/user';
import { RouterButton } from '../components/RouterButton';

export const Dashboard = () => {
  const { rounds, updateRounds, addRound } = useRounds();
  const { users, updateUsers } = useUsers();
  const { loading: roundsLoading, getCollectionData } = useCollectionDataOnce<Round>(roundsRef);
  const { loading: usersLoading, getCollectionData: getUserCollectionData } = useCollectionDataOnce<
    User
  >(userRef);
  const { loading: addLoading, addDocument } = useAddDocument<RoundInput>(roundsRef);

  React.useEffect(() => {
    const fetchRounds = async () => {
      await getCollectionData().then(newRounds => {
        updateRounds(newRounds);
      });
    };

    if (!rounds) {
      fetchRounds();
    }
  }, [rounds]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await getUserCollectionData().then(newUsers => {
        updateUsers(newUsers);
      });
    };

    if (!users) {
      fetchUsers();
    }
  }, [users]);

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
      ) : users ? (
        users.map(user => {
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
