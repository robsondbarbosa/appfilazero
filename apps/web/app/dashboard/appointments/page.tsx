'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Loader2, Plus } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/lib/auth-context'
import { requestJson, resolveTenantId } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'

type Appointment = {
  id: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  serviceId: string
  professionalId: string
  dateTime: string | { toDate?: () => Date }
  duration: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  price: number
}

type ServiceItem = {
  id: string
  name: string
}

type Professional = {
  id: string
  name: string
}

function parseDateTime(value: Appointment['dateTime']) {
  if (typeof value === 'string') {
    return new Date(value)
  }

  if (value && typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate()
  }

  return new Date()
}

export default function AppointmentsPage() {
  const { user, loading } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const tenantId = useMemo(() => resolveTenantId(user?.tenantId), [user?.tenantId])

  useEffect(() => {
    if (loading) {
      return
    }

    if (!tenantId) {
      setError('Nenhum estabelecimento vinculado à sua conta.')
      setFetching(false)
      return
    }

    void (async () => {
      try {
        setFetching(true)
        const [appointmentsResponse, servicesResponse, professionalsResponse] = await Promise.all([
          requestJson<Appointment[]>(`/${tenantId}/appointments`),
          requestJson<ServiceItem[]>(`/${tenantId}/services`),
          requestJson<Professional[]>(`/${tenantId}/professionals`),
        ])

        setAppointments(appointmentsResponse)
        setServices(servicesResponse)
        setProfessionals(professionalsResponse)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Não foi possível carregar os agendamentos.')
      } finally {
        setFetching(false)
      }
    })()
  }, [loading, tenantId])

  const servicesMap = useMemo(
    () => new Map(services.map((service) => [service.id, service.name])),
    [services]
  )
  const professionalsMap = useMemo(
    () => new Map(professionals.map((professional) => [professional.id, professional.name])),
    [professionals]
  )

  const statusClasses: Record<Appointment['status'], string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-300',
    CONFIRMED: 'bg-green-500/20 text-green-300',
    COMPLETED: 'bg-blue-500/20 text-blue-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
    NO_SHOW: 'bg-gray-500/20 text-gray-300',
  }

  const statusLabels: Record<Appointment['status'], string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
    NO_SHOW: 'Não compareceu',
  }

  return (
    <DashboardShell
      title="Agendamentos"
      subtitle="Acompanhe todos os atendimentos e seus respectivos status."
      action={
        <Link href="/dashboard/appointments/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Novo agendamento
        </Link>
      }
    >
      {fetching ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : error ? (
        <div className="card border-red-500/20 text-red-400">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Você ainda não possui agendamentos cadastrados.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Serviço</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Profissional</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Data e hora</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Valor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const appointmentDate = parseDateTime(appointment.dateTime)

                  return (
                    <tr key={appointment.id} className="border-b border-dark-100/50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-white">{appointment.clientName}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.clientPhone || appointment.clientEmail || 'Sem contato'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {servicesMap.get(appointment.serviceId) || appointment.serviceId}
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {professionalsMap.get(appointment.professionalId) || appointment.professionalId}
                      </td>
                      <td className="px-4 py-4 text-gray-300">{formatDateTime(appointmentDate)}</td>
                      <td className="px-4 py-4 text-white">{formatCurrency(appointment.price)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[appointment.status]}`}>
                          {statusLabels[appointment.status]}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}