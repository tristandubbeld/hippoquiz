import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Text, Box, Spinner, Flex, Badge } from '@chakra-ui/core';

import { useCollectionDataOnce } from '../context/firebaseContext';
import { RouterLink } from '../components/RouterLink';
import { RouterButton } from '../components/RouterButton';
import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';

import { User } from '../types/user';
import { Round } from '../types/round';
import { roundsRef, userRef } from '../utils/references';
import { useUsers } from '../context/usersContext';

interface OverviewProps {
  user?: User;
}

export const Overview = ({ user }: OverviewProps) => {
  const { rounds, updateRounds } = useRounds();
  const { users, updateUsers } = useUsers();
  const match = useRouteMatch();

  const { loading: roundsLoading, getCollectionData } = useCollectionDataOnce<Round>(roundsRef);
  const {
    loading: usersLoading,
    getCollectionData: getUsersCollectionData,
  } = useCollectionDataOnce<User>(userRef);

  React.useEffect(() => {
    const fetchRounds = async () => {
      await getCollectionData().then(newRounds => {
        updateRounds(newRounds);
      });
    };

    if (!rounds) {
      fetchRounds();
    }
  }, [rounds, getCollectionData, updateRounds]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await getUsersCollectionData().then(newUsers => {
        updateUsers(newUsers);
      });
    };

    if (!users) {
      fetchUsers();
    }
  }, [users, getUsersCollectionData, updateUsers]);

  if (!user) {
    return (
      <div>
        <Text as="h1" fontSize="2xl">
          Oeps...
        </Text>
        <Text as="span" fontSize="3xl">
          Er is iets mis gegaan
        </Text>
        <Box height={8} />
        <Text>
          Ga terug naar{' '}
          <RouterLink to="/" color="purple.500">
            de vorige pagina
          </RouterLink>
          .
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Text fontSize="2xl" as="h1">
        Goed bezig{' '}
        <Text fontWeight="700" as="span" color="purple.900">
          {user.name}
        </Text>
        !
      </Text>

      <Box height={4} />

      {roundsLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <Text>Klik op een ronde hieronder om je antwoorden in te vullen.</Text>
          <Box height={4} />
          <RoundList rounds={rounds} />
        </React.Fragment>
      )}

      <Box height={8} />

      <Text as="h2" fontWeight="700" color="purple.900">
        Wie doen er mee?
      </Text>

      <Box height={4} />

      {usersLoading ? (
        <Flex align="center" justify="center" height="xs">
          <Spinner />
        </Flex>
      ) : users ? (
        <Box>
          {users &&
            users.map(user => {
              return (
                <Badge key={user.id} variantColor="purple" fontSize={14} mr={2} mb={2}>
                  {user.name}
                </Badge>
              );
            })}
        </Box>
      ) : (
        <Box>No users found</Box>
      )}

      <Box height={4} />

      <RouterButton to={`${match.url}/scoreboard`} variantColor="purple" isFullWidth>
        Check hier het scorebord
      </RouterButton>
    </div>
  );
};
