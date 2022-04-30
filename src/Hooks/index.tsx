import { initializeApp } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { collection, doc, getFirestore, updateDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { useToast, UseToastOptions } from '@chakra-ui/react'
import { useMyClients } from '../Context/MyClients'
import { useMyCompanies } from '../Context/MyCompanies'
import { usePdf } from './usePdf'

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// firebase root app instance
const useFirebaseApp = () => app

// firebase db instance
const useFirestore = () => getFirestore(app)

// firebase new Company collection reference
const useCompanyColRef = () => {
  const firestore = useFirestore()
  return collection(firestore, 'Company')
}

// firebase Company collection reference
const useCompanyDocRef = (docId: string) => {
  const firestore = useFirestore()
  return doc(firestore, 'Company', docId)
}

// firebase new Series collection reference
const useSeriesColRef = () => {
  const firestore = useFirestore()
  return collection(firestore, 'Series')
}

// firebase Series collection reference
const useSeriesDocRef = (docId: string) => {
  const firestore = useFirestore()
  return doc(firestore, 'Series', docId)
}

// firebase new Client collection reference
const useClientColRef = () => {
  const firestore = useFirestore()
  return collection(firestore, 'Client')
}

// firebase Client collection reference
const useClientDocRef = (docId: string) => {
  const firestore = useFirestore()
  return doc(firestore, 'Client', docId)
}

// firebase auth update document helper
const useUpdateDoc = (model: string) => {
  const firestore = useFirestore()
  return (docId: string, data: Partial<unknown>) => updateDoc(doc(firestore, model, docId), data)
}

// firebase storage instance
const useStorage = () => getStorage(app)

/**
 * Extends chakra UI Toast component to add custom logic to generic notifications.
 * @returns toast function to call when a notification is needed.
 */
const useAppToast = () => {
  const toast = useToast()

  return (options?: UseToastOptions | undefined) => toast({ ...options, isClosable: options?.isClosable ?? true })
}

const useCuiList = (model: 'Client' | 'Company') => {
  const { registeredAccounts: clientCuis } = useMyClients()
  const { registeredAccounts: myCuis } = useMyCompanies()

  const cuis = model === 'Client' ? clientCuis : myCuis

  return cuis ?? []
}

export {
  useFirebaseApp,
  useFirestore,
  useStorage,
  useAppToast,
  useClientColRef,
  useUpdateDoc,
  useClientDocRef,
  useCompanyColRef,
  useCompanyDocRef,
  useCuiList,
  usePdf,
  useSeriesColRef,
  useSeriesDocRef,
}
