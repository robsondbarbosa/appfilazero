'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/lib/auth-context'
import { requestJson, resolveTenantId } from '@/lib/api'

type TenantSettings = {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  description?: string
  bookingWindow: number
  cancelDeadline: number
  requirePayment: boolean
  autoConfirm: boolean
}

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
        const response = await requestJson<TenantSettings>(`/tenants/id/${tenantId}`)
        setSettings(response)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Não foi possível carregar as configurações.')
      } finally {
        setFetching(false)
      }
    })()
  }, [loading, tenantId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!tenantId || !settings) {
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await requestJson<TenantSettings>(`/tenants/${tenantId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: settings.name,
          email: settings.email,
          phone: settings.phone || '',
          whatsapp: settings.whatsapp || '',
          address: settings.address || '',
          city: settings.city || '',
          state: settings.state || '',
          zipCode: settings.zipCode || '',
          description: settings.description || '',
          bookingWindow: Number(settings.bookingWindow),
          cancelDeadline: Number(settings.cancelDeadline),
          requirePayment: settings.requirePayment,
          autoConfirm: settings.autoConfirm,
        }),
      })

      setSettings(response)
      setSuccess('Configurações salvas com sucesso.')
    } catch (submitError) {
      console.error(submitError)
      setError('Não foi possível salvar as configurações.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell
      title="Configurações"
      subtitle="Atualize os dados do estabelecimento e as regras operacionais."
    >
      {fetching ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : !settings ? (
        <div className="card border-red-500/20 text-red-400">{error || 'Configuração não encontrada.'}</div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="card space-y-5">
            <div>
              <h2 className="font-montserrat text-2xl font-bold text-white">Dados do estabelecimento</h2>
              <p className="mt-2 text-gray-400">Essas informações abastecem o painel e futuras integrações.</p>
            </div>

            {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">{error}</div> : null}
            {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">{success}</div> : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Nome</label>
                <input
                  className="input"
                  value={settings.name}
                  onChange={(event) => setSettings((current) => (current ? { ...current, name: event.target.value } : current))}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  className="input"
                  value={settings.email}
                  onChange={(event) => setSettings((current) => (current ? { ...current, email: event.target.value } : current))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Telefone</label>
                <input
                  className="input"
                  value={settings.phone || ''}
                  onChange={(event) => setSettings((current) => (current ? { ...current, phone: event.target.value } : current))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">WhatsApp</label>
                <input
                  className="input"
                  value={settings.whatsapp || ''}
                  onChange={(event) => setSettings((current) => (current ? { ...current, whatsapp: event.target.value } : current))}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Descrição</label>
              <textarea
                className="input min-h-[120px] resize-none"
                value={settings.description || ''}
                onChange={(event) => setSettings((current) => (current ? { ...current, description: event.target.value } : current))}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Endereço</label>
              <input
                className="input"
                value={settings.address || ''}
                onChange={(event) => setSettings((current) => (current ? { ...current, address: event.target.value } : current))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Cidade</label>
                <input
                  className="input"
                  value={settings.city || ''}
                  onChange={(event) => setSettings((current) => (current ? { ...current, city: event.target.value } : current))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Estado</label>
                <input
                  className="input"
                  value={settings.state || ''}
                  onChange={(event) => setSettings((current) => (current ? { ...current, state: event.target.value } : current))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">CEP</label>
                <input
                  className="input"
                  value={settings.zipCode || ''}
                  onChange={(event) => setSettings((current) => (current ? { ...current, zipCode: event.target.value } : current))}
                />
              </div>
            </div>
          </div>

          <div className="card space-y-5">
            <div>
              <h2 className="font-montserrat text-2xl font-bold text-white">Regras do sistema</h2>
              <p className="mt-2 text-gray-400">Ajuste comportamento do agendamento e confirmação.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Janela de agendamento (dias)</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  value={settings.bookingWindow}
                  onChange={(event) => setSettings((current) => (current ? { ...current, bookingWindow: Number(event.target.value) } : current))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Prazo de cancelamento (horas)</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  value={settings.cancelDeadline}
                  onChange={(event) => setSettings((current) => (current ? { ...current, cancelDeadline: Number(event.target.value) } : current))}
                />
              </div>
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-dark-100 bg-dark-200 p-4">
              <div>
                <p className="font-medium text-white">Exigir pagamento</p>
                <p className="text-sm text-gray-400">Ativa cobrança como parte do fluxo.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requirePayment}
                onChange={(event) => setSettings((current) => (current ? { ...current, requirePayment: event.target.checked } : current))}
                className="h-5 w-5 rounded border-dark-100 bg-dark text-gold"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-dark-100 bg-dark-200 p-4">
              <div>
                <p className="font-medium text-white">Confirmação automática</p>
                <p className="text-sm text-gray-400">Confirma novos horários sem revisão manual.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoConfirm}
                onChange={(event) => setSettings((current) => (current ? { ...current, autoConfirm: event.target.checked } : current))}
                className="h-5 w-5 rounded border-dark-100 bg-dark text-gold"
              />
            </label>

            <button type="submit" disabled={saving} className="btn-primary inline-flex w-full items-center justify-center gap-2">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>
        </form>
      )}
    </DashboardShell>
  )
}