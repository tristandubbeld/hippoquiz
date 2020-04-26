import React from 'react';
import { Box, Stack, Flex, Icon, Text } from '@chakra-ui/core';
import { RouterLink } from './RouterLink';
import { useRouteMatch } from 'react-router-dom';

import { Round } from '../App';
import { Card } from './Card';

interface RoundListProps {
  rounds?: Round[];
}

export const RoundList = ({ rounds }: RoundListProps) => {
  const match = useRouteMatch();

  return (
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
  );
};