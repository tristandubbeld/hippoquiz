import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';
import fire from '../fire.png';

export const ScoreBoard = () => {
  return (
    <div>
      <Text fontSize="2xl" as="h1">
        Het{' '}
        <Text fontWeight="700" as="span" color="purple.900">
          Scorebord
        </Text>
      </Text>
      <Box height={4} />
      <CardList as="ol">
        <CardListItem>
          <Flex
            align="center"
            backgroundImage={`url(${fire})`}
            backgroundSize="cover"
            backgroundPosition="center">
            <Flex justify="center" align="center" p={4} w={16} borderRight="1px">
              <Text as="span" fontWeight={700} fontSize="xl">
                1
              </Text>
            </Flex>
            <Text as="span" pl={4} fontWeight="700" fontSize="xl">
              Hendrik
            </Text>
          </Flex>
        </CardListItem>
        <CardListItem>
          <Flex align="center">
            <Flex justify="center" p={4} w={16} borderRight="1px">
              2
            </Flex>
            <Text as="span" pl={4}>
              Sebastiaan
            </Text>
          </Flex>
        </CardListItem>
        <CardListItem lastChild>
          <Flex align="center">
            <Flex justify="center" p={4} w={16} borderRight="1px">
              3
            </Flex>
            <Text as="span" pl={4}>
              Florian
            </Text>
          </Flex>
        </CardListItem>
      </CardList>
    </div>
  );
};

interface CardListProps {
  as: 'ol' | 'ul';
}

export const CardList: React.FC<CardListProps> = ({ children, as = 'ul' }) => {
  return (
    <Box as={as} border="1px" borderRadius="md" backgroundColor="white">
      {children}
    </Box>
  );
};

interface CardListItemProps {
  lastChild?: boolean;
}

export const CardListItem: React.FC<CardListItemProps> = ({ children, lastChild }) => {
  return (
    <Box borderBottom={lastChild ? undefined : '1px'} position="relative">
      {children}
    </Box>
  );
};
