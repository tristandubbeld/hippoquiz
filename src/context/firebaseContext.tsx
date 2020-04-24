import React from 'react';
import { FirebaseFirestore } from '@firebase/firestore-types';

import { db } from '../utils/firebase';

const FirebaseContext = React.createContext<FirebaseFirestore | undefined>(undefined);

export const FirebaseProvider: React.FC = ({ children }) => {
  return <FirebaseContext.Provider value={db}>{children}</FirebaseContext.Provider>;
};

/*
 * Custom useFirestore hook
 */

export function useFirestore() {
  const context = React.useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }

  return context;
}

/*
 * Custom useSaveToFirestore hook
 */

export type SaveAction =
  | { type: 'saveToStoreStart' }
  | { type: 'saveToStoreSuccess' }
  | { type: 'saveToStoreFailed'; payload: string };

export type SaveDispatch = (action: SaveAction) => void;

interface SaveState {
  loading: boolean;
  error: string | undefined;
  success: boolean;
}

function saveReducer(state: SaveState, action: SaveAction) {
  switch (action.type) {
    case 'saveToStoreStart': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'saveToStoreSuccess': {
      return {
        ...state,
        loading: false,
        error: undefined,
        success: true,
      };
    }
    case 'saveToStoreFailed': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

interface FirestoreValues {
  [key: string]: any;
}

const saveInitialState: SaveState = {
  loading: false,
  error: undefined,
  success: false,
};

export function useSaveToFirestore() {
  const context = React.useContext(FirebaseContext);
  const [{ loading, error, success }, dispatch] = React.useReducer(saveReducer, saveInitialState);

  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }

  const saveToStore = async (collection: string, values: FirestoreValues) => {
    dispatch({ type: 'saveToStoreStart' });

    return await context
      .collection(collection)
      .add(values)
      .then(docRef => {
        dispatch({
          type: 'saveToStoreSuccess',
        });

        return docRef.id;
      })
      .catch(err => {
        dispatch({
          type: 'saveToStoreFailed',
          payload: err,
        });
      });
  };

  return {
    loading,
    error,
    success,
    saveToStore,
  };
}
