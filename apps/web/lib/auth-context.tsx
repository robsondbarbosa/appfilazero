'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { clearStoredTenantId, getStoredTenantId, setStoredTenantId } from '@/lib/api'
import { getFirebaseClient } from '@/lib/firebase'
import { User, UserRole } from '@filazero/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, phone?: string, tenantId?: string) => Promise<void>
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
      const { auth, db } = await getFirebaseClient()
      const { doc, getDoc } = await import('firebase/firestore')

      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser)

        if (fbUser) {
          const profileSnapshot = await getDoc(doc(db, 'users', fbUser.uid))
          const profile = profileSnapshot.exists() ? profileSnapshot.data() : null
          const tenantId =
            typeof profile?.tenantId === 'string' && profile.tenantId
              ? profile.tenantId
              : getStoredTenantId()

          if (tenantId) {
            setStoredTenantId(tenantId)
          }

          setUser({
            id: fbUser.uid,
            email: profile?.email || fbUser.email || '',
            tenantId: tenantId || undefined,
            name: profile?.name || fbUser.displayName || '',
            phone: profile?.phone || '',
            role: (profile?.role as UserRole) || UserRole.CLIENT,
            isActive: profile?.isActive ?? true,
            createdAt:
              profile?.createdAt && typeof profile.createdAt.toDate === 'function'
                ? profile.createdAt.toDate()
                : new Date(),
            updatedAt:
              profile?.updatedAt && typeof profile.updatedAt.toDate === 'function'
                ? profile.updatedAt.toDate()
                : new Date(),
          })
        } else {
          clearStoredTenantId()
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

  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    tenantId?: string
  ) => {
    const { auth, db } = await getFirebaseClient()
    const { doc, serverTimestamp, setDoc } = await import('firebase/firestore')
    const result = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(result.user, { displayName: name })

    await setDoc(
      doc(db, 'users', result.user.uid),
      {
        email,
        name,
        phone: phone || '',
        tenantId: tenantId || '',
        role: UserRole.TENANT_ADMIN,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    if (tenantId) {
      setStoredTenantId(tenantId)
    }
  }

  const signOut = async () => {
    const { auth } = await getFirebaseClient()
    await firebaseSignOut(auth)
    clearStoredTenantId()
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