'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  Calendar,
  Clock3,
  LogOut,
  Scissors,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type DashboardShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  action?: ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
  { href: '/dashboard/appointments', label: 'Agendamentos', icon: Calendar },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/services', label: 'Serviços', icon: Scissors },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export function DashboardShell({ title, subtitle, children, action }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-dark">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-dark-100/50 bg-dark-100 lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold">
              <Scissors className="h-6 w-6 text-dark" />
            </div>
            <span className="font-montserrat text-xl font-bold text-gradient-gold">FilaZero</span>
          </Link>
        </div>

        <nav className="space-y-2 px-4 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-gray-400 hover:bg-dark-100 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="p-4 lg:ml-64 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3 lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold">
                  <Scissors className="h-6 w-6 text-dark" />
                </div>
                <span className="font-montserrat text-xl font-bold text-gradient-gold">FilaZero</span>
              </Link>
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-white">{title}</h1>
            <p className="mt-2 text-gray-400">
              {subtitle}
              {user?.name ? ` • ${user.name}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl bg-dark-100 p-2 text-gray-400 transition-colors hover:text-white">
              <Bell className="h-6 w-6" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {action}
          </div>
        </header>

        <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-dark-100 px-4 py-3 text-sm text-red-400 whitespace-nowrap"
          >
            <Clock3 className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}