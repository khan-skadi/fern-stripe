import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyAUavZkuco-nuvZqYHD68Wz4mKqCGQ-SWI',
  authDomain: 'fern-stripe.firebaseapp.com',
  projectId: 'fern-stripe',
  storageBucket: 'fern-stripe.appspot.com',
  messagingSenderId: '961872580739',
  appId: '1:961872580739:web:3be6d18d22ba213db8cbb6',
  measurementId: 'G-LYS2QCX5G7'
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
