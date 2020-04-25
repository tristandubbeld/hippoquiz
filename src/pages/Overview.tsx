import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Text, Box, Stack, Spinner, Flex, Icon, Badge } from '@chakra-ui/core';

import { User, Round } from '../App';
// import { useGetFromFirestore } from '../context/firebaseContext';
import { RouterLink } from '../components/RouterLink';
import { Card } from '../components/Card';
import { RouterButton } from '../components/RouterButton';

interface OverviewProps {
  user?: User;
  rounds?: Round[];
}

interface UserData {
  name: string;
}

export const Overview = ({ user, rounds }: OverviewProps) => {
  const match = useRouteMatch();
  // const { loading, error, documents } = useGetFromFirestore('users');

  const loading = false;
  const error = '';
  const documents: any[] = [];

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

      <div>
        <Text>Klik op een ronde hieronder om je antwoorden in te vullen.</Text>
        <Box height={4} />
        <Stack spacing={2}>
          {rounds &&
            rounds.map((round, index) => {
              const roundNumber = index + 1;

              return (
                <RouterLink key={round.id} to={`${match.url}/round/${roundNumber}`}>
                  <Card isSmall borderColor={round.isClosed ? 'green.400' : undefined}>
                    <Flex direction="row" align="center" justify="space-between">
                      <Text isTruncated color={round.isClosed ? 'green.400' : undefined}>
                        Ronde {roundNumber}: {round.name}
                      </Text>
                      {round.isClosed ? (
                        <Icon name="check" mr="3px" color="green.400" />
                      ) : (
                        <Icon name="chevron-right" size="24px" />
                      )}
                    </Flex>
                  </Card>
                </RouterLink>
              );
            })}
        </Stack>
      </div>

      <Box height={8} />

      <Text fontWeight="700">Wie doen er mee?</Text>

      <Box height={4} />

      <div>
        <Box>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Hendrik
          </Badge>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Friet land
          </Badge>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Kaas de kaasboer
          </Badge>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Frokkie
          </Badge>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Jonko
          </Badge>
          <Badge variantColor="purple" fontSize={14} mr={2} mb={2}>
            Florian
          </Badge>
        </Box>
        <Box height={4} />
        <RouterButton to={`${match.url}/scoreboard`} variantColor="purple" isFullWidth>
          Check hier het scorebord
        </RouterButton>
      </div>

      <div>
        {loading ? (
          <Flex align="center" justify="center" height="xs">
            <Spinner />
          </Flex>
        ) : (
          <div>
            {users &&
              users.map(user => {
                return <div key={user.id}>{user.name}</div>;
              })}
          </div>
        )}
        {error && (
          <div>
            <div>{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
