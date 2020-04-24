import React from 'react';
import { BrowserRouter as Router, Route, Switch, useRouteMatch } from 'react-router-dom';

import { Landing } from './pages/Landing';
import { FirebaseProvider } from './context/firebaseContext';

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

const QuizPages = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}`} exact>
        <div>Overview</div>
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
