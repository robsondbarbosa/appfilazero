'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return <>{children}</>
}