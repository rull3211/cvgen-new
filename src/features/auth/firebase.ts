import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAnalytics, type Analytics, isSupported } from 'firebase/analytics'

// Your provided Firebase config (safe to use client-side)
const firebaseConfig = {
  apiKey: 'AIzaSyC9XPKxiRVnNCeew6lpzREJq-lnsqCrhjY',
  authDomain: 'cv-generator-b8c44.firebaseapp.com',
  projectId: 'cv-generator-b8c44',
  storageBucket: 'cv-generator-b8c44.firebasestorage.app',
  messagingSenderId: '90108621223',
  appId: '1:90108621223:web:6cd1a0d7db8f6969634682',
  measurementId: 'G-75KBRB2RN3',
}

// Initialize Firebase app (singleton)
const FirebaseInstance: FirebaseApp = initializeApp(firebaseConfig)

// Export initialized services
export const auth: Auth = getAuth(FirebaseInstance)
export const db: Firestore = getFirestore(FirebaseInstance)

// Only initialize Analytics if supported (e.g., in browser)
export let analytics: Analytics | null = null
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(FirebaseInstance)
})

export default FirebaseInstance
