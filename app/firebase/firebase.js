import * as firebase from 'firebase/app';
import ReduxSagaFirebase from 'redux-saga-firebase';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';

import firebaseConfig from './config';


const firebaseApp = firebase.initializeApp(firebaseConfig);

export const firebaseDb = firebase.database();
export const firebaseFirestoreDb = firebase.firestore();
export const firebaseSocialAuth = firebase.auth();
export const firebaseStorage = firebase.storage();
export const rsf = new ReduxSagaFirebase(firebaseApp);
export const firebaseAuth = rsf.auth;
export const firebaseRsfFirestore = rsf.firestore;


export default firebaseApp;