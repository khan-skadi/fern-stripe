import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { FirebaseAppProvider } from 'reactfire';

export const firebaseConfig = {
  apiKey: 'AIzaSyAUavZkuco-nuvZqYHD68Wz4mKqCGQ-SWI',
  authDomain: 'fern-stripe.firebaseapp.com',
  projectId: 'fern-stripe',
  storageBucket: 'fern-stripe.appspot.com',
  messagingSenderId: '961872580739',
  appId: '1:961872580739:web:3be6d18d22ba213db8cbb6',
  measurementId: 'G-LYS2QCX5G7'
};

export const stripePromise = loadStripe('pk_test_51IKqb4EJUP4eE4AJTeNbQMO2zOMNYyx8Iz4YjzIB68JcC87HyUCysTyLAYyLYGbuJ8HNwfSvZ2Tm9ciK0dA0P0OC00FEqc1APd');

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
