// Firebase Client - Configuração com credenciais reais
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: any;

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBt16NKxV0elaCebh1CN8tTs-rkxqb1AQc",
  authDomain: "appfilazero.firebaseapp.com",
  projectId: "appfilazero",
  storageBucket: "appfilazero.firebasestorage.app",
  messagingSenderId: "55912409258",
  appId: "1:55912409258:web:c244f6d54cf648bd8508d3"
};

// Função para inicializar Firebase apenas no cliente
export function initFirebase() {
  if (typeof window === 'undefined') return { app: undefined, auth: undefined, db: undefined, googleProvider: undefined };
  
  if (app) return { app, auth, db, googleProvider };
  
  try {
    const { initializeApp, getApps, getApp } = require('firebase/app');
    const { getAuth, GoogleAuthProvider } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.error('Firebase init error:', e);
  }
  
  return { app, auth, db, googleProvider };
}

// Exporta função que retorna as instâncias
export function getFirebase() {
  return initFirebase();
}

// Para compatibilidade com código existente
export { app, auth, db, googleProvider };
