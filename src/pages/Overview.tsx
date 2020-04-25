import React from 'react';

import { User, Round } from '../App';
import { Link, useRouteMatch } from 'react-router-dom';
// import { useGetFromFirestore } from '../context/firebaseContext';

interface OverviewProps {
  user?: User;
  rounds?: Round[];
}

interface UserData {
  name: string;
}

export const Overview = ({ user, rounds }: OverviewProps) => {
  const match = useRouteMatch();
  // const { loading, error, documents } = useGetFromFirestore('users');

  const loading = false;
  const error = '';
  const documents: any[] = [];

  const users = documents
    ? documents.map(doc => {
        const id = doc.id;
        const user = doc.data() as UserData;

        return {
          id,
          name: user.name,
        };
      })
    : undefined;

  if (!user) {
    return <div>Please go back to the homepage, something went wrong</div>;
  }

  return (
    <div>
      <div>Hello {user.name}</div>

      <div>
        {loading ? (
          <div>Loading</div>
        ) : (
          <div>
            {users &&
              users.map(user => {
                return <div key={user.id}>{user.name}</div>;
              })}
          </div>
        )}
        {error && (
          <div>
            <div>{error}</div>
          </div>
        )}
      </div>

      <div>
        <div>Rondes</div>
        <div>Klik op een ronde om je antwoorden in te vullen</div>
        {rounds &&
          rounds.map((round, index) => {
            const roundNumber = index + 1;

            return (
              <Link key={round.id} to={`${match.url}/round/${roundNumber}`}>
                Ronde {roundNumber}: {round.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
};
