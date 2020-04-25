import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

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
        <CardListItem startAdornment="1" isObtrusive>
          <Text as="span" fontWeight="700" fontSize="xl">
            Naam
          </Text>
        </CardListItem>
        <CardListItem startAdornment="2">Naam</CardListItem>
        <CardListItem startAdornment="3" lastChild>
          Naam
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
  startAdornment?: string;
  isObtrusive?: boolean;
}

export const CardListItem: React.FC<CardListItemProps> = ({
  children,
  lastChild,
  startAdornment,
  isObtrusive,
}) => {
  return (
    <Flex borderBottom={lastChild ? undefined : '1px'}>
      {startAdornment && (
        <Flex justify="center" align="center" py={4} px={4} w={16} borderRight="1px">
          <Text
            as="span"
            fontWeight={isObtrusive ? 700 : undefined}
            fontSize={isObtrusive ? 'xl' : undefined}>
            {startAdornment}
          </Text>
        </Flex>
      )}
      <Box py={4} px={4}>
        {children}
      </Box>
    </Flex>
  );
};
