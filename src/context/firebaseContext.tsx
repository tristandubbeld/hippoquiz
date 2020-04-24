import React from 'react';
import { FirebaseFirestore } from '@firebase/firestore-types';

import { db } from '../utils/firebase';

const FirebaseContext = React.createContext<FirebaseFirestore | undefined>(undefined);

export const FirebaseProvider: React.FC = ({ children }) => {
  return <FirebaseContext.Provider value={db}>{children}</FirebaseContext.Provider>;
};

export function useFirestore() {
  const context = React.useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }

  return context;
}

interface FirestoreValue {
  [key: string]: any;
}

export function useSaveToFirestore() {
  const context = React.useContext(FirebaseContext);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [success, setSuccess] = React.useState<boolean>(false);

  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }

  const saveToStore = async (collection: string, values: FirestoreValue) => {
    setLoading(true);

    return await context
      .collection(collection)
      .add(values)
      .then(docRef => {
        if (error) {
          setError(undefined);
        }

        setSuccess(true);
        setLoading(false);

        return docRef.id;
      })
      .catch(err => {
        if (setSuccess) {
          setSuccess(false);
        }

        setError(err);
      });
  };

  return {
    loading,
    error,
    success,
    saveToStore,
  };
}
