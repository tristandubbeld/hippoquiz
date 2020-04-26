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
import { Round } from './types/round';
import { User } from './types/user';

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

const rounds: Round[] = [
  {
    id: 'r1',
    name: 'optional name',
    questions: [
      {
        id: 'r1_q1',
      },
      {
        id: 'r1_q2',
        isAnswered: true,
      },
      {
        id: 'r1_q3',
      },
    ],
  },
  {
    id: 'r2',
    isClosed: true,
    questions: [
      {
        id: 'r2_q1',
      },
    ],
  },
  {
    id: 'r3',
    name: 'optional name',
    questions: [
      {
        id: 'r3_q1',
      },
    ],
  },
];

const QuizPages = () => {
  const match = useRouteMatch();
  const { data: user } = loadFromLocalStorage<User>('user');

  return (
    <Switch>
      <Route path={`${match.path}`} exact>
        <Overview user={user} rounds={rounds} />
      </Route>
      <Route path={`${match.path}/scoreboard`} exact>
        <ScoreBoard />
      </Route>
      <Route path={`${match.path}/round/:roundNumber`} exact>
        <RoundDetails rounds={rounds} />
      </Route>
      <Route path={`${match.path}/dashboard`} exact>
        <Dashboard rounds={rounds} />
      </Route>
      <Route path={`${match.path}/dashboard/round/:roundNumber`} exact>
        <RoundSettings />
      </Route>
      <Route path={`${match.path}/dashboard/round/:roundNumber/questions`} exact>
        <RoundQuestions />
      </Route>
      <Route path={`${match.path}/*`}>
        <Box fontSize="2xl">404 not found</Box>
      </Route>
    </Switch>
  );
};

export default App;
