import React from 'react';
import {
  FirebaseFirestore,
  QueryDocumentSnapshot,
  CollectionReference,
} from '@firebase/firestore-types';

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

interface QueryOptions {
  rawData?: boolean;
}

export function useCollectionOnce<T>(
  collectionRef: CollectionReference<T>,
  options?: QueryOptions,
) {
  const [reference] = React.useState(collectionRef);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<QueryDocumentSnapshot[] | T[] | undefined>(undefined);

  React.useEffect(() => {
    setLoading(true);

    async function getData() {
      await reference.get().then(querySnapshot => {
        setLoading(false);

        if (options?.rawData) {
          setData(querySnapshot.docs);
        } else {
          const documentData = querySnapshot.docs.map(document => document.data());

          setData(documentData);
        }
      });
    }

    getData();
  }, [reference]);

  return {
    data,
    loading,
  };
}

/*
 * Custom useSaveToFirestore hook
 */

type SaveAction =
  | { type: 'saveToStoreStart' }
  | { type: 'saveToStoreSuccess' }
  | { type: 'saveToStoreFailed'; payload: string };

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
        success: false,
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
    throw new Error('useSaveToFirestore must be used within a FirebaseProvider');
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

/*
 * Custom useGetFromFirestore hook
 */

type GetAction =
  | { type: 'getFromStoreStart' }
  | { type: 'getFromStoreSuccess'; payload: QueryDocumentSnapshot<unknown>[] }
  | { type: 'getFromStoreFailed'; payload: string };

interface GetState {
  loading: boolean;
  error?: string;
  documents?: QueryDocumentSnapshot<unknown>[];
}

function getReducer<T>(state: GetState, action: GetAction) {
  switch (action.type) {
    case 'getFromStoreStart': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'getFromStoreSuccess': {
      return {
        ...state,
        loading: false,
        error: undefined,
        documents: action.payload,
      };
    }
    case 'getFromStoreFailed': {
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

const getInitialState = {
  loading: false,
};

export function useGetFromFirestore(collection: string) {
  const context = React.useContext(FirebaseContext);

  const [{ loading, error, documents }, dispatch] = React.useReducer<
    (state: GetState, action: GetAction) => GetState
  >(getReducer, getInitialState);

  if (context === undefined) {
    throw new Error('useGetFromFirestore must be used within a FirebaseProvider');
  }

  React.useEffect(() => {
    const getColFromStore = async () => {
      dispatch({ type: 'getFromStoreStart' });

      return await context
        .collection(collection)
        .get()
        .then(snapshot => {
          const documents = snapshot.docs;

          dispatch({
            type: 'getFromStoreSuccess',
            payload: documents,
          });
        })
        .catch(err => {
          dispatch({
            type: 'getFromStoreFailed',
            payload: err,
          });
        });
    };

    getColFromStore();
  }, [context, collection]);

  return {
    loading,
    error,
    documents,
  };
}
