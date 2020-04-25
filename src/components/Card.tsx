import React from 'react';
import { Box } from '@chakra-ui/core';

interface CardProps {
  isSmall?: boolean;
  borderColor?: string;
  bgColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, isSmall, borderColor, bgColor }) => (
  <Box
    p={isSmall ? 4 : 8}
    border="1px"
    borderRadius="md"
    borderColor={borderColor || 'gray.800'}
    backgroundColor={bgColor || 'white'}>
    {children}
  </Box>
);
