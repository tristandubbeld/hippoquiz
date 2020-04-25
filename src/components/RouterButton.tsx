import React from 'react';

import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/core';

export const RouterButton: React.FC<ChakraButtonProps & ReactRouterLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <ChakraButton {...rest} as={ReactRouterLink}>
      {children}
    </ChakraButton>
  );
};
