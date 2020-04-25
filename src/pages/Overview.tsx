import React from 'react';

import { User } from '../App';
import { useGetFromFirestore } from '../context/firebaseContext';

interface OverviewProps {
  user?: User;
}

interface UserData {
  name: string;
}

export const Overview = ({ user }: OverviewProps) => {
  const { loading, error, documents } = useGetFromFirestore('users');
  const [users, setUsers] = React.useState<User[]>();

  React.useEffect(() => {
    if (documents) {
      const users = documents.map(doc => {
        const id = doc.id;
        const user = doc.data() as UserData;

        return {
          id,
          name: user.name,
        };
      });

      setUsers(users);
    }
  }, [documents]);

  if (!user) {
    return <div>Please go back to the homepage, something went wrong</div>;
  }

  return (
    <div>
      <div>Hello {user.name}</div>
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
  );
};
