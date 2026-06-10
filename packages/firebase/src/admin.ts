// Admin-side Firebase (API)
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

function createAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const app = createAdminApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

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
