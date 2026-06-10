'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Mail, Phone, Users } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/lib/auth-context'
import { requestJson, resolveTenantId } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

type Client = {
  id: string
  name: string
  email: string
  phone: string
  totalAppointments: number
  totalSpent: number
  lastAppointment: string | null
}

export default function ClientsPage() {
  const { user, loading } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
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
        const response = await requestJson<Client[]>(`/${tenantId}/clients`)
        setClients(response)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Não foi possível carregar a lista de clientes.')
      } finally {
        setFetching(false)
      }
    })()
  }, [loading, tenantId])

  return (
    <DashboardShell
      title="Clientes"
      subtitle="Veja o relacionamento e o histórico consolidado dos seus clientes."
    >
      {fetching ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : error ? (
        <div className="card border-red-500/20 text-red-400">{error}</div>
      ) : clients.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Nenhum cliente encontrado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <div className="card">
              <p className="text-sm text-gray-400">Clientes cadastrados</p>
              <p className="mt-2 text-3xl font-bold text-white">{clients.length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400">Atendimentos somados</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {clients.reduce((total, client) => total + client.totalAppointments, 0)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-400">Receita acumulada</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {formatCurrency(clients.reduce((total, client) => total + client.totalSpent, 0))}
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Contato</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Visitas</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Faturamento</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Último atendimento</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-dark-100/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{client.name}</p>
                            <p className="text-sm text-gray-500">ID: {client.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gold" />
                            <span>{client.email || 'Não informado'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gold" />
                            <span>{client.phone || 'Não informado'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-white">{client.totalAppointments}</td>
                      <td className="px-4 py-4 text-white">{formatCurrency(client.totalSpent)}</td>
                      <td className="px-4 py-4 text-gray-300">
                        {client.lastAppointment ? formatDate(client.lastAppointment) : 'Sem histórico'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}