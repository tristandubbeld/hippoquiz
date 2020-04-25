import React from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';

import { FirebaseProvider } from './context/firebaseContext';

import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
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

const QuizPages = () => {
  const match = useRouteMatch();
  const { data: user } = loadFromLocalStorage<User>('user');

  return (
    <Switch>
      <Route path={`${match.path}`} exact>
        <Overview user={user} />
      </Route>
      <Route path={`${match.path}/scoreboard`} exact>
        <div>Scoreboard</div>
      </Route>
      <Route path={`${match.path}/round/:roundId`} exact>
        <div>Round id</div>
      </Route>
    </Switch>
  );
};

export default App;
