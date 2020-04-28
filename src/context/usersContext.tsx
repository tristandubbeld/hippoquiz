import React from 'react';

import { User } from '../types/user';

interface UsersState {
  users: User[] | undefined;
  updateUsers: (newUsers: User[]) => void;
}

const UsersContext = React.createContext<UsersState | undefined>(undefined);

export const UsersProvider: React.FC = ({ children }) => {
  const [users, setUsers] = React.useState<User[] | undefined>();

  const updateUsers = (newUsers: User[]) => {
    // removes users that don't exist in firestore anymore
    // adds users that are new in the firestore
    const updatedUsers = newUsers.filter(newUser => {
      // if the user already exists
      const exists = users?.find(user => {
        return user.id === newUser.id;
      });

      if (exists) {
        // return the existing user
        return exists;
      }

      // return the new user
      return newUser;
    });

    // update the state
    setUsers(updatedUsers);
  };

  return <UsersContext.Provider value={{ users, updateUsers }}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const context = React.useContext<UsersState | undefined>(UsersContext);

  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }

  return context;
};
