'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Scissors, Trash2 } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/lib/auth-context'
import { requestJson, resolveTenantId } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

type ServiceItem = {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
}

type ServiceForm = {
  name: string
  description: string
  duration: string
  price: string
}

const initialForm: ServiceForm = {
  name: '',
  description: '',
  duration: '30',
  price: '0',
}

export default function ServicesPage() {
  const { user, loading } = useAuth()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<ServiceForm>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const tenantId = useMemo(() => resolveTenantId(user?.tenantId), [user?.tenantId])

  const loadServices = async () => {
    if (!tenantId) {
      setError('Nenhum estabelecimento vinculado à sua conta.')
      setFetching(false)
      return
    }

    try {
      setFetching(true)
      const response = await requestJson<ServiceItem[]>(`/${tenantId}/services`)
      setServices(response)
    } catch (fetchError) {
      console.error(fetchError)
      setError('Não foi possível carregar os serviços.')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      void loadServices()
    }
  }, [loading, tenantId])

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!tenantId) {
      setError('Nenhum estabelecimento vinculado à sua conta.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        name: form.name,
        description: form.description,
        duration: Number(form.duration),
        price: Number(form.price),
      }

      if (editingId) {
        await requestJson(`/${tenantId}/services/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await requestJson(`/${tenantId}/services`, {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      resetForm()
      await loadServices()
    } catch (submitError) {
      console.error(submitError)
      setError('Não foi possível salvar o serviço.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      duration: String(service.duration),
      price: String(service.price),
    })
  }

  const handleDelete = async (serviceId: string) => {
    if (!tenantId) {
      return
    }

    try {
      await requestJson(`/${tenantId}/services/${serviceId}`, {
        method: 'DELETE',
      })
      await loadServices()
    } catch (deleteError) {
      console.error(deleteError)
      setError('Não foi possível remover o serviço.')
    }
  }

  return (
    <DashboardShell
      title="Serviços"
      subtitle="Cadastre, edite e mantenha a tabela de serviços do seu estabelecimento."
      action={
        <button
          onClick={() => {
            resetForm()
            const target = document.getElementById('service-form')
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo serviço
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form id="service-form" onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <h2 className="font-montserrat text-2xl font-bold text-white">
              {editingId ? 'Editar serviço' : 'Cadastrar serviço'}
            </h2>
            <p className="mt-2 text-gray-400">Defina preço, duração e descrição comercial.</p>
          </div>

          {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div> : null}

          <div>
            <label className="mb-2 block text-sm text-gray-400">Nome</label>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="input"
              placeholder="Ex.: Corte masculino"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Descrição</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="input min-h-[120px] resize-none"
              placeholder="Descreva o serviço."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Duração (min)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                className="input"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Preço (R$)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="input"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Scissors className="h-5 w-5" />}
              {editingId ? 'Salvar alterações' : 'Cadastrar serviço'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancelar edição
              </button>
            ) : null}
          </div>
        </form>

        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-montserrat text-2xl font-bold text-white">Serviços ativos</h2>
              <p className="mt-2 text-gray-400">Atualizados diretamente pela API.</p>
            </div>
            <div className="rounded-xl bg-dark-200 px-4 py-3 text-sm text-gray-300">
              {services.length} cadastrados
            </div>
          </div>

          {fetching ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dark-100 bg-dark-200 p-8 text-center text-gray-400">
              Nenhum serviço cadastrado.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="rounded-2xl border border-dark-100 bg-dark-200 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        {service.description || 'Sem descrição informada.'}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
                        <span className="rounded-full bg-dark px-3 py-1">{service.duration} min</span>
                        <span className="rounded-full bg-dark px-3 py-1">{formatCurrency(service.price)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="rounded-xl border border-dark-100 p-3 text-gray-300 transition-colors hover:border-gold hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void handleDelete(service.id)}
                        className="rounded-xl border border-dark-100 p-3 text-red-400 transition-colors hover:border-red-500/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}