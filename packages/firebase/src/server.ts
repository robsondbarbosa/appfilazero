import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
  type CollectionReference,
  type DocumentReference,
  type Firestore,
  type Query,
  type DocumentData,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBt16NKxV0elaCebh1CN8tTs-rkxqb1AQc',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'appfilazero.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'appfilazero',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'appfilazero.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '55912409258',
  appId: process.env.FIREBASE_APP_ID || '1:55912409258:web:c244f6d54cf648bd8508d3',
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage = null;

export function getTenantRef(tenantId: string): DocumentReference<DocumentData> {
  return doc(db, 'tenants', tenantId);
}

export function getServicesQuery(tenantId: string): Query<DocumentData> {
  return query(collection(db, 'services'), where('tenantId', '==', tenantId));
}

export function getProfessionalsQuery(tenantId: string): Query<DocumentData> {
  return query(collection(db, 'professionals'), where('tenantId', '==', tenantId));
}

export function getAppointmentsQuery(tenantId: string): Query<DocumentData> {
  return query(collection(db, 'appointments'), where('tenantId', '==', tenantId));
}

export function getPaymentsQuery(tenantId: string): Query<DocumentData> {
  return query(collection(db, 'payments'), where('tenantId', '==', tenantId));
}

export function getCollection<T extends DocumentData = DocumentData>(path: string): CollectionReference<T> {
  return collection(db, path) as CollectionReference<T>;
}

export function getDocument<T extends DocumentData = DocumentData>(path: string, id: string): DocumentReference<T> {
  return doc(db, path, id) as DocumentReference<T>;
}

export { app, db, auth, storage };