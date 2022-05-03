import { CloseIcon } from '@chakra-ui/icons';
import { Container, Heading, IconButton } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { ENV } from '../environments';

export const AppHeader: FunctionComponent = () => {
  const logout = () => {}; // not implemented

  return (
    <Container
      centerContent
      sx={{
        color: 'white',
        height: '60px',
        padding: '12px 16px',
        position: 'relative',
      }}
    >
      <Heading as="h1" sx={{ fontSize: '16px' }}>
        memlog<small>@{ENV.version}</small>
      </Heading>

      {false && <IconButton onClick={logout} size="xs" colorScheme="white" aria-label="Logout" icon={<CloseIcon />} sx={{ position: 'absolute', right: '8px', top: '12px' }} />}
    </Container>
  );
};
