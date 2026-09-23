import { initializeApp, getApps, cert, type ServiceAccount, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore, type CollectionReference, type DocumentReference, type Query, type DocumentData } from 'firebase-admin/firestore';

import { getStorage, type Storage } from 'firebase-admin/storage';

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0]!;
  }

  // Tenta carregar service account das env vars (formato JSON string ou caminho)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const parsed = JSON.parse(serviceAccountJson) as ServiceAccount;
      return initializeApp({
        credential: cert(parsed),
      });
    } catch {
      // Se não for JSON válido, tenta como caminho de arquivo
      return initializeApp({
        credential: cert(serviceAccountJson),
      });
    }
  }

  // Fallback para Application Default Credentials (GCP / Vercel)
  return initializeApp();
}

const app: App = getAdminApp();
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage: Storage = getStorage(app);

export function getTenantRef(tenantId: string): DocumentReference<DocumentData> {
  return db.collection('tenants').doc(tenantId);
}

export function getServicesQuery(tenantId: string): Query<DocumentData> {
  return db.collection('services').where('tenantId', '==', tenantId);
}

export function getProfessionalsQuery(tenantId: string): Query<DocumentData> {
  return db.collection('professionals').where('tenantId', '==', tenantId);
}

export function getAppointmentsQuery(tenantId: string): Query<DocumentData> {
  return db.collection('appointments').where('tenantId', '==', tenantId);
}

export function getPaymentsQuery(tenantId: string): Query<DocumentData> {
  return db.collection('payments').where('tenantId', '==', tenantId);
}

export function getCollection<T extends DocumentData = DocumentData>(path: string): CollectionReference<T> {
  return db.collection(path) as CollectionReference<T>;
}

export function getDocument<T extends DocumentData = DocumentData>(path: string, id: string): DocumentReference<T> {
  return db.collection(path).doc(id) as DocumentReference<T>;
}

export { app, db, auth, storage };
