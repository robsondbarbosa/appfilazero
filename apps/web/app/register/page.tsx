'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Loader2, Lock, Mail, Phone, User } from 'lucide-react'
import { getFirebaseClient } from '@/lib/firebase'
import { setStoredTenantId, slugify } from '@/lib/api'
import { UserRole } from '@filazero/types'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { auth, db } = await getFirebaseClient()
      const [{ createUserWithEmailAndPassword, updateProfile }, { doc, setDoc, serverTimestamp }] =
        await Promise.all([import('firebase/auth'), import('firebase/firestore')])

      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })

      const tenantId = credential.user.uid
      const tenantSlug = `${slugify(name || email.split('@')[0] || 'filazero')}-${tenantId.slice(0, 6)}`

      await Promise.all([
        setDoc(doc(db, 'tenants', tenantId), {
          name,
          slug: tenantSlug,
          email,
          phone,
          whatsapp: phone,
          primaryColor: '#D4AF37',
          secondaryColor: '#1A1A1A',
          bookingWindow: 30,
          cancelDeadline: 24,
          requirePayment: true,
          autoConfirm: false,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
        setDoc(doc(db, 'users', credential.user.uid), {
          email,
          name,
          phone,
          tenantId,
          role: UserRole.TENANT_ADMIN,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
      ])

      setStoredTenantId(tenantId)
      router.push('/dashboard')
    } catch (submitError) {
      console.error(submitError)
      setError('Não foi possível criar sua conta. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-dark to-dark-400 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
              <Calendar className="h-7 w-7 text-dark" />
            </div>
            <span className="font-montserrat text-3xl font-bold text-gradient-gold">FilaZero</span>
          </Link>
          <p className="mt-2 text-gray-400">Crie sua conta e configure seu estabelecimento</p>
        </div>

        <div className="card">
          {error ? (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input pl-12"
                  placeholder="Nome do responsável ou estabelecimento"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input pl-12"
                  placeholder="contato@seunegocio.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="input pl-12"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input pl-12"
                  placeholder="Mínimo de 6 caracteres"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-4">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Já tem conta?{' '}
            <Link href="/login" className="font-medium text-gold hover:text-gold-light">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}