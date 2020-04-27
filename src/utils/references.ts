import { CollectionReference } from '@firebase/firestore-types';

import { db } from './firebase';

import { Collection } from '../types/collections';
import { Round } from '../types/round';
import { User } from '../types/user';

export const roundsRef = db.collection(Collection.ROUNDS) as CollectionReference<Round>;

export const userRef = db.collection(Collection.USERS) as CollectionReference<User>;
