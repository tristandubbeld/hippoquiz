import React from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';

import { FirebaseProvider } from './context/firebaseContext';

import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { RoundDetails } from './pages/RoundDetails';
import { loadFromLocalStorage } from './utils/localStorage';

function App() {
  return (
    <FirebaseProvider>
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
    </FirebaseProvider>
  );
}

export interface User {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  title?: string;
}

export interface Round {
  id: string;
  name?: string;
  questions: Question[];
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
      },
      {
        id: 'r1_q3',
      },
    ],
  },
  {
    id: 'r2',
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
        <div>Scoreboard</div>
      </Route>
      <Route path={`${match.path}/round/:roundNumber`} exact>
        <RoundDetails rounds={rounds} />
      </Route>
    </Switch>
  );
};

export default App;
