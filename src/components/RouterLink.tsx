import React from 'react';

import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/core';

export const RouterLink: React.FC<ChakraLinkProps & ReactRouterLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <ChakraLink {...rest} as={ReactRouterLink}>
      {children}
    </ChakraLink>
  );
};
