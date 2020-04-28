import React from 'react';
import { FirebaseFirestore, CollectionReference } from '@firebase/firestore-types';

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

export function useCollectionDataOnce<T>(collectionRef: CollectionReference<T>) {
  const [loading, setLoading] = React.useState<boolean>(false);
  // const [error, setError] = React.useState<string | undefined>(undefined);

  const getCollectionData = async () => {
    setLoading(true);

    const promise = await collectionRef.get().then(querySnapshot => {
      setLoading(false);

      const documentData = querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
      })) as T[];

      return documentData;
    });

    return promise;
  };

  return {
    getCollectionData,
    loading,
  };
}

export function useAddDocument<T>(collectionRef: CollectionReference) {
  const [loading, setLoading] = React.useState(false);

  async function addDocument(data: T) {
    setLoading(true);

    const promise = await collectionRef.add(data).then(documentRef => {
      setLoading(false);

      return documentRef.id;
    });

    return promise;
  }

  return {
    loading,
    addDocument,
  };
}

// export function useUpdateDocument(
//   documentRef, key: string, value
// ) {

// }

export function useRemoveDocument(collectionRef: CollectionReference) {
  // removingId is the loading state
  const [removingId, setRemovingId] = React.useState<string | undefined>(undefined);

  async function removeDocument(documentId: string) {
    setRemovingId(documentId);

    const promise = await collectionRef
      .doc(documentId)
      .delete()
      .then(() => {
        setRemovingId(undefined);
      });

    return promise;
  }

  return {
    removingId,
    removeDocument,
  };
}
