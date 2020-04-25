import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Text, Box, Stack, Spinner, Flex, Icon, Badge } from '@chakra-ui/core';

import { User, Round } from '../App';
// import { useGetFromFirestore } from '../context/firebaseContext';
import { RouterLink } from '../components/RouterLink';
import { Card } from '../components/Card';
import { RouterButton } from '../components/RouterButton';
import { RoundList } from '../components/RoundList';

interface OverviewProps {
  user?: User;
  rounds?: Round[];
}

interface UserData {
  name: string;
}

const dummyUsers = [
  {
    id: '1',
    name: 'Hendrik',
  },
  {
    id: '2',
    name: 'Friet land',
  },
  {
    id: '3',
    name: 'Kaas de kaasboer',
  },
  {
    id: '4',
    name: 'Frokkie',
  },
  {
    id: '5',
    name: 'Jonko',
  },
  {
    id: '6',
    name: 'Florian',
  },
];

export const Overview = ({ user, rounds }: OverviewProps) => {
  const match = useRouteMatch();
  // const { loading, error, documents } = useGetFromFirestore('users');

  const loading = false;
  const error = '';
  // const documents: any[] = [];

  // const users = documents
  //   ? documents.map(doc => {
  //       const id = doc.id;
  //       const user = doc.data() as UserData;

  //       return {
  //         id,
  //         name: user.name,
  //       };
  //     })
  //   : undefined;

  const users = dummyUsers;

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

      <RoundList rounds={rounds} />

      <Box height={8} />

      <Text fontWeight="700">Wie doen er mee?</Text>

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
