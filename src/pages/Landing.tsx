import React from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Button, FormControl, FormLabel, Text, Box } from '@chakra-ui/core';

import { useSaveToFirestore } from '../context/firebaseContext';
import { saveToLocalStorage } from '../utils/localStorage';
import { User } from '../types/user';

export const Landing = () => {
  const name = React.useRef<HTMLInputElement>(null);
  const history = useHistory();
  const { loading, error, saveToStore } = useSaveToFirestore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && name.current) {
      const nameValue = name.current.value;

      saveToStore('users', { name: name.current.value }).then(id => {
        if (typeof id === 'string') {
          saveToLocalStorage<User>('user', {
            name: nameValue,
            id: id,
          });

          history.push('/quiz');
        }
      });
    }
  };

  return (
    <div>
      <Text fontSize="4xl" as="h1">
        De grote{' '}
        <Text fontWeight="700" color="purple.900">
          Nijlpaarden
        </Text>{' '}
        pubquiz
      </Text>
      <Box height={8} />
      <div>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired pb={4}>
            <FormLabel htmlFor="name">Naam</FormLabel>
            <Input id="name" type="text" ref={name} placeholder="Augustinus" isDisabled={loading} />
          </FormControl>
          <Button variantColor="purple" type="submit" isLoading={loading} isFullWidth>
            Verder
          </Button>
          {error && <div>{error}</div>}
        </form>
      </div>
    </div>
  );
};
