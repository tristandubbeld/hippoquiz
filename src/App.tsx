import React from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core';

import { FirebaseProvider } from './context/firebaseContext';
import { theme } from './theme';

import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { RoundDetails } from './pages/RoundDetails';
import { ScoreBoard } from './pages/Scoreboard';
import { Dashboard } from './pages/Dashboard';
import { RoundSettings } from './pages/RoundSettings';
import { loadFromLocalStorage } from './utils/localStorage';
import { RoundQuestions } from './pages/RoundQuestions';
import { User } from './types/user';
import { RoundsProvider } from './context/roundsContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <FirebaseProvider>
        <Box maxW="md" marginX="auto" marginY={8} px={6}>
          <Router>
            <Switch>
              <Route path="/" exact>
                <Landing />
              </Route>
              <Route path="/quiz">
                <QuizPages />
              </Route>
              <Route path="*">
                <Box fontSize="2xl">404 not found</Box>
              </Route>
            </Switch>
          </Router>
        </Box>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

const QuizPages = () => {
  const match = useRouteMatch();
  const { data: user } = loadFromLocalStorage<User>('user');

  return (
    <RoundsProvider>
      <Switch>
        <Route path={`${match.path}`} exact>
          <Overview user={user} />
        </Route>
        <Route path={`${match.path}/scoreboard`} exact>
          <ScoreBoard />
        </Route>
        <Route path={`${match.path}/round/:roundId`} exact>
          <RoundDetails />
        </Route>
        <Route path={`${match.path}/dashboard`} exact>
          <Dashboard />
        </Route>
        <Route path={`${match.path}/dashboard/round/:roundId`} exact>
          <RoundSettings />
        </Route>
        <Route path={`${match.path}/dashboard/round/:roundId/questions`} exact>
          <RoundQuestions />
        </Route>
        <Route path={`${match.path}/*`}>
          <Box fontSize="2xl">404 not found</Box>
        </Route>
      </Switch>
    </RoundsProvider>
  );
};

export default App;
