'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Scissors,
  LogOut,
  Plus,
  ChevronRight,
  Bell
} from 'lucide-react'
import { auth } from '@filazero/firebase/client'

interface DashboardStats {
  todayAppointments: number
  weekRevenue: number
  totalClients: number
  occupancyRate: number
}

interface Appointment {
  id: string
  clientName: string
  serviceName: string
  professionalName: string
  dateTime: Date
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  price: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    weekRevenue: 0,
    totalClients: 0,
    occupancyRate: 0
  })
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      loadDashboardData()
    })

    return () => unsubscribe()
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Simular dados - em produção viria da API
      setStats({
        todayAppointments: 8,
        weekRevenue: 2450,
        totalClients: 156,
        occupancyRate: 78
      })

      setTodayAppointments([
        {
          id: '1',
          clientName: 'João Silva',
          serviceName: 'Corte + Barba',
          professionalName: 'Carlos',
          dateTime: new Date(),
          status: 'CONFIRMED',
          price: 60
        },
        {
          id: '2',
          clientName: 'Maria Santos',
          serviceName: 'Coloração',
          professionalName: 'Ana',
          dateTime: new Date(),
          status: 'PENDING',
          price: 150
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-gold text-xl">Carregando...</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-blue-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmado'
      case 'PENDING': return 'Pendente'
      case 'COMPLETED': return 'Concluído'
      case 'CANCELLED': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-100 border-r border-dark-100/50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Scissors className="w-6 h-6 text-dark" />
            </div>
            <span className="font-montserrat font-bold text-xl text-gradient-gold">
              FilaZero
            </span>
          </Link>
        </div>

        <nav className="px-4 py-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/10 text-gold"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-100 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Agendamentos</span>
          </Link>
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-100 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </Link>
          <Link
            href="/dashboard/services"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-100 hover:text-white transition-colors"
          >
            <Scissors className="w-5 h-5" />
            <span>Serviços</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-100 hover:text-white transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span>Configurações</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Bem-vindo de volta, {user?.displayName || 'Administrador'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-dark-100 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href="/dashboard/appointments/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Agendamento
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <span className="text-green-400 text-sm">+12%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.todayAppointments}
            </div>
            <div className="text-gray-400 text-sm">Agendamentos Hoje</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-green-400 text-sm">+8%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              R$ {stats.weekRevenue.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Receita da Semana</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-green-400 text-sm">+5%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalClients}
            </div>
            <div className="text-gray-400 text-sm">Total de Clientes</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-gray-400 text-sm">Estável</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.occupancyRate}%
            </div>
            <div className="text-gray-400 text-sm">Taxa de Ocupação</div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-montserrat font-bold text-white">
              Agendamentos de Hoje
            </h2>
            <Link
              href="/dashboard/appointments"
              className="text-gold hover:text-gold-light flex items-center gap-1 text-sm"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Serviço</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Profissional</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Horário</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-dark-100/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold font-bold">
                            {appointment.clientName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {appointment.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{appointment.serviceName}</td>
                    <td className="py-4 px-4 text-gray-300">{appointment.professionalName}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {appointment.dateTime.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      R$ {appointment.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)} text-white`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
