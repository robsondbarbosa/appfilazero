export { app, auth, db, storage, googleProvider } from './client';
export { 
  app as adminApp, 
  auth as adminAuth, 
  db as adminDb, 
  storage as adminStorage,
  getTenantRef,
  getServicesQuery,
  getProfessionalsQuery,
  getAppointmentsQuery,
  getPaymentsQuery
} from './admin';
