import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Text, Box, Spinner, Flex, Badge } from '@chakra-ui/core';

import { useGetFromFirestore, useCollectionDataOnce } from '../context/firebaseContext';
import { RouterLink } from '../components/RouterLink';
import { RouterButton } from '../components/RouterButton';
import { RoundList } from '../components/RoundList';
import { useRounds } from '../context/roundsContext';

import { User } from '../types/user';
import { Round } from '../types/round';
import { roundsRef } from '../utils/references';

interface OverviewProps {
  user?: User;
}

interface UserData {
  name: string;
}

export const Overview = ({ user }: OverviewProps) => {
  const { rounds, updateRounds } = useRounds();
  const { data: initialRounds, loading: roundsLoading } = useCollectionDataOnce<Round>(roundsRef);
  const match = useRouteMatch();

  React.useEffect(() => {
    if (rounds.length === 0 && initialRounds) {
      updateRounds(initialRounds);
    }
  }, [rounds, initialRounds, updateRounds]);

  const { loading, error, documents } = useGetFromFirestore('users');

  const users = documents
    ? documents.map(doc => {
        const id = doc.id;
        const user = doc.data() as UserData;

        return {
          id,
          name: user.name,
        };
      })
    : undefined;

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
          <RoundList rounds={rounds} />
        </React.Fragment>
      )}

      <Box height={8} />

      <Text as="h2" fontWeight="700" color="purple.900">
        Wie doen er mee?
      </Text>

      <Box height={4} />

      <div>
        {loading ? (
          <Flex align="center" justify="center" height="xs">
            <Spinner />
          </Flex>
        ) : (
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
        )}
        {error && (
          <div>
            <div>{error}</div>
          </div>
        )}
        <Box height={4} />
        <RouterButton to={`${match.url}/scoreboard`} variantColor="purple" isFullWidth>
          Check hier het scorebord
        </RouterButton>
      </div>
    </div>
  );
};
