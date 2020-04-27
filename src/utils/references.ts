import { CollectionReference } from '@firebase/firestore-types';

import { db } from './firebase';

import { Collection } from '../types/collections';
import { Round } from '../types/round';

export const roundsRef = db.collection(Collection.ROUNDS) as CollectionReference<Round>;
