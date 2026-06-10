'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { getFirebaseClient } from '@/lib/firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { auth } = await getFirebaseClient()
      const { sendPasswordResetEmail } = await import('firebase/auth')

      await sendPasswordResetEmail(auth, email)
      setSuccess('Enviamos um link de recuperação para o email informado.')
    } catch (submitError) {
      console.error(submitError)
      setError('Não foi possível enviar o email de recuperação.')
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
          <p className="mt-2 text-gray-400">Recupere o acesso à sua conta</p>
        </div>

        <div className="card">
          {error ? (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>{success}</span>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input pl-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-4">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}