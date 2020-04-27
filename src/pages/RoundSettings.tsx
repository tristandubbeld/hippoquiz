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
  Alert,
  AlertIcon,
} from '@chakra-ui/core';
import { useRouteMatch, useParams, useHistory } from 'react-router-dom';

import { useRemoveDocument } from '../context/firebaseContext';
import { RouterButton } from '../components/RouterButton';
import { roundsRef } from '../utils/references';
import { useRounds } from '../context/roundsContext';

export const RoundSettings = () => {
  const { roundId } = useParams();
  const match = useRouteMatch();
  const history = useHistory();
  const { removeRound } = useRounds();

  const [closeAlertOpen, setCloseAlertOpen] = React.useState(false);
  const closeCancelRef = React.useRef<HTMLButtonElement>(null);

  const [removeAlertOpen, setRemoveAlertOpen] = React.useState(false);
  const removeCancelRef = React.useRef<HTMLButtonElement>(null);

  const { removingId, removeDocument } = useRemoveDocument(roundsRef);

  if (!roundId) {
    return <div>Round not found</div>;
  }

  const openRoundCloseAlert = () => {
    // check something with localstorage for do not show again
    setCloseAlertOpen(true);
  };

  const closeRoundCloseAlert = () => {
    setCloseAlertOpen(false);
  };

  const handleRemoveRound = () => {
    removeDocument(roundId)
      .then(() => {
        // remove round from state
        removeRound(roundId);

        history.push('/quiz/dashboard');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const openRemoveRoundAlert = () => {
    // check something with localstorage for do not show again
    setRemoveAlertOpen(true);
  };

  const closeRemoveRoundAlert = () => {
    setRemoveAlertOpen(false);
  };

  return (
    <div>
      <RouterButton to="/quiz/dashboard" leftIcon="arrow-back" variant="link" color="purple.400">
        Overzicht
      </RouterButton>

      <Box height={4} />

      <Text as="h1" fontSize="2xl">
        Ronde instellingen
      </Text>

      <Box height={4} />

      <Flex justify="space-between" align="center">
        <FormLabel htmlFor="round-closed">Ronde afgelopen?</FormLabel>
        <Switch id="round-closed" color="green" onChange={openRoundCloseAlert} />
      </Flex>
      <FormHelperText>
        Wanneer een ronde afgelopen is kunnen de spelers geen antwoorden meer invoeren.
      </FormHelperText>

      <Box height={8} />

      {/* TODO: if closed */}
      <Alert status="info">
        <AlertIcon />
        Let op: Deze ronde is gemarkeerd als afgelopen.
      </Alert>

      <Box height={8} />

      <Stack spacing={4}>
        <RouterButton to={`${match.url}/questions`} variantColor="purple">
          Vragen toevoegen / wijzigen
        </RouterButton>
        <RouterButton to={`${match.url}/answersheets`} variantColor="purple">
          Ronde nakijken
        </RouterButton>
        <Button onClick={openRemoveRoundAlert} variantColor="red">
          Ronde verwijderen
        </Button>
      </Stack>

      <AlertDialog isOpen={closeAlertOpen} leastDestructiveRef={closeCancelRef}>
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
            <Button ref={closeCancelRef} onClick={closeRoundCloseAlert}>
              Annuleren
            </Button>
            <Button variantColor="red" onClick={closeRoundCloseAlert} ml={3}>
              Ronde sluiten
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog isOpen={removeAlertOpen} leastDestructiveRef={removeCancelRef}>
        <AlertDialogOverlay />
        <AlertDialogContent width="calc(100% - 24px)">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Ronde verwijderen
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>Weet je zeker dat je deze ronde wilt verwijderen?</Text>
            <Box height={4} />
            <Checkbox variantColor="purple">Niet meer vragen</Checkbox>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={removeCancelRef} onClick={closeRemoveRoundAlert}>
              Annuleren
            </Button>
            <Button
              onClick={handleRemoveRound}
              isLoading={Boolean(removingId)}
              variantColor="red"
              ml={3}>
              Ronde verwijderen
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
