'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { getFirebaseClient } from '@/lib/firebase'
import { User, UserRole } from '@filazero/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    void (async () => {
      const { auth } = await getFirebaseClient()

      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser)

        if (fbUser) {
          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || '',
            role: UserRole.CLIENT,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } else {
          setUser(null)
        }

        setLoading(false)
      })
    })()

    return () => {
      unsubscribe?.()
    }
  }, [])

  const loginWithGoogle = async () => {
    const { auth, googleProvider } = await getFirebaseClient()
    await signInWithPopup(auth, googleProvider)
  }

  const loginWithEmail = async (email: string, password: string) => {
    const { auth } = await getFirebaseClient()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, name: string) => {
    const { auth } = await getFirebaseClient()
    const result = await createUserWithEmailAndPassword(auth, email, password)

    console.log('Usuário registrado:', result.user.uid, name)
  }

  const signOut = async () => {
    const { auth } = await getFirebaseClient()
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        register,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}