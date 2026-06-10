'use client'

import type { Auth, GoogleAuthProvider } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

type FirebaseClient = {
  auth: Auth
  db: Firestore
  googleProvider: GoogleAuthProvider
}

let firebaseClientPromise: Promise<FirebaseClient> | null = null

export function getFirebaseClient(): Promise<FirebaseClient> {
  if (!firebaseClientPromise) {
    firebaseClientPromise = (async () => {
      const [{ getApp, getApps, initializeApp }, { getAuth, GoogleAuthProvider }, { getFirestore }] =
        await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore'),
        ])

      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

      return {
        auth: getAuth(app),
        db: getFirestore(app),
        googleProvider: new GoogleAuthProvider(),
      }
    })()
  }

  return firebaseClientPromise
}