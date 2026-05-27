'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, UserRole } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  register: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Só acessa localStorage no cliente
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('filazero_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (e) {
        console.error('Erro ao ler localStorage:', e)
      }
    }
  }, [])

  const loginWithGoogle = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const mockUser: User = {
        id: 'google-' + Date.now(),
        email: 'usuario@gmail.com',
        name: 'Usuário Google',
        role: UserRole.CLIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUser(mockUser)
      localStorage.setItem('filazero_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Erro no login com Google:', error)
      throw error
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    if (typeof window === 'undefined') return
    
    try {
      if (email && password) {
        const mockUser: User = {
          id: 'email-' + Date.now(),
          email: email,
          name: email.split('@')[0],
          role: UserRole.CLIENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setUser(mockUser)
        localStorage.setItem('filazero_user', JSON.stringify(mockUser))
      } else {
        throw new Error('Email ou senha inválidos')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    if (typeof window === 'undefined') return
    
    try {
      const mockUser: User = {
        id: 'new-' + Date.now(),
        email: email,
        name: name,
        role: UserRole.CLIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUser(mockUser)
      localStorage.setItem('filazero_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  const signOut = async () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('filazero_user')
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      loginWithEmail, 
      register, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
