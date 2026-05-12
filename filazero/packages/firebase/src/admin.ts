// Admin-side Firebase (API)
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let app: App;
let db: Firestore;
let auth: Auth;
let storage: Storage;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

// Helper functions for Firestore queries
export function getTenantRef(tenantId: string) {
  return db.collection('tenants').doc(tenantId);
}

export function getServicesQuery(tenantId: string) {
  return db.collection('services').where('tenantId', '==', tenantId);
}

export function getProfessionalsQuery(tenantId: string) {
  return db.collection('professionals').where('tenantId', '==', tenantId);
}

export function getAppointmentsQuery(tenantId: string) {
  return db.collection('appointments').where('tenantId', '==', tenantId);
}

export function getPaymentsQuery(tenantId: string) {
  return db.collection('payments').where('tenantId', '==', tenantId);
}

export { app, db, auth, storage };
