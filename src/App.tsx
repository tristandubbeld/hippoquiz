import React from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';
import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core';

import { FirebaseProvider } from './context/firebaseContext';
import { theme } from './theme';

import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { RoundDetails } from './pages/RoundDetails';
import { loadFromLocalStorage } from './utils/localStorage';
import { ScoreBoard } from './pages/Scoreboard';

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
            </Switch>
          </Router>
        </Box>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export interface User {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  title?: string;
  isAnswered?: boolean;
}

export interface Round {
  id: string;
  name?: string;
  questions: Question[];
  isClosed?: boolean;
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
    </Switch>
  );
};

export default App;
