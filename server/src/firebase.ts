// Initialize Firebase Admin resources
// When working with NodeJS, you use firebase-admin
import * as firebaseAdmin from 'firebase-admin';
firebaseAdmin.initializeApp();

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
