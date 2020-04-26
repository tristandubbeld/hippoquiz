import React from 'react';
import {
  Text,
  Flex,
  Switch,
  FormLabel,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Checkbox,
  Stack,
  FormHelperText,
} from '@chakra-ui/core';
import { useRouteMatch } from 'react-router-dom';

import { RouterButton } from '../components/RouterButton';

export const RoundSettings = () => {
  const match = useRouteMatch();

  const [closeAlertOpen, setCloseAlertOpen] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleRoundClose = () => {
    // check something with localstorage do not show again

    setCloseAlertOpen(true);
  };

  const handleAlertClose = () => {
    setCloseAlertOpen(false);
  };

  return (
    <div>
      <RouterButton to="/quiz/dashboard" leftIcon="arrow-back" variant="link" color="purple.400">
        Overzicht
      </RouterButton>

      <Box height={4} />

      <Text as="h1" fontSize="2xl">
        Ronde # instellingen
      </Text>

      <Box height={4} />

      <Flex justify="space-between" align="center">
        <FormLabel htmlFor="round-closed">Ronde afgelopen?</FormLabel>
        <Switch id="round-closed" color="green" onChange={handleRoundClose} />
      </Flex>
      <FormHelperText>
        Wanneer een ronde afgelopen is kunnen de spelers geen antwoorden meer invoeren.
      </FormHelperText>

      <Box height={8} />

      <Stack spacing={4}>
        <RouterButton to={`${match.path}/questions`} variantColor="purple">
          Vragen toevoegen / wijzigen
        </RouterButton>
        <RouterButton to={`${match.path}/answersheets`} variantColor="purple">
          Ronde nakijken
        </RouterButton>
      </Stack>

      <AlertDialog isOpen={closeAlertOpen} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />
        <AlertDialogContent width="calc(100% - 24px)">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Ronde markeren als afgelopen
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>Weet je zeker dat je de ronde wilt sluiten?</Text>
            <Box height={4} />
            <Checkbox variantColor="purple">Niet meer vragen</Checkbox>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleAlertClose}>
              Annuleren
            </Button>
            <Button variantColor="red" onClick={handleAlertClose} ml={3}>
              Ronde sluiten
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
