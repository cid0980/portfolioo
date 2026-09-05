import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

/**
 * Firebase web config.
 * These values are PUBLIC by design — they ship inside the built bundle
 * no matter what. Security is enforced by Firestore security rules and
 * Firebase Authentication, not by hiding these keys.
 *
 * Env vars (.env.local) override the baked-in defaults if present.
 */
const env = import.meta.env

const DEFAULTS = {
  apiKey: 'AIzaSyDThnZ1grOUoK52JqnI2oyvZgl8jraWhBY',
  authDomain: 'portfolio-31108.firebaseapp.com',
  projectId: 'portfolio-31108',
  storageBucket: 'portfolio-31108.firebasestorage.app',
  messagingSenderId: '733789430647',
  appId: '1:733789430647:web:3142b14a1058777f83b772',
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || DEFAULTS.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULTS.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || DEFAULTS.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULTS.storageBucket,
  messagingSenderId:
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULTS.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || DEFAULTS.appId,
}

/** true only when every required key is present */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.authDomain,
)

let app: FirebaseApp | null = null
let dbInstance: Firestore | null = null
let authInstance: Auth | null = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    dbInstance = getFirestore(app)
    authInstance = getAuth(app)
  } catch {
    /* never let a Firebase failure break the site */
    app = null
    dbInstance = null
    authInstance = null
  }
}

export const db = dbInstance
export const auth = authInstance

/** collection that stores one document per visit */
export const VISITS = 'visits'
