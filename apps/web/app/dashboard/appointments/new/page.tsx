'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Loader2, Scissors, User } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useAuth } from '@/lib/auth-context'
import { requestJson, resolveTenantId, toIsoDateTime } from '@/lib/api'
import { formatCurrency, generateTimeSlots } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
}

interface Professional {
  id: string
  name: string
  services: string[]
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const tenantId = useMemo(() => resolveTenantId(user?.tenantId), [user?.tenantId])

  useEffect(() => {
    if (loading) {
      return
    }

    if (!tenantId) {
      setError('Nenhum estabelecimento vinculado à sua conta.')
      setPageLoading(false)
      return
    }

    void (async () => {
      try {
        setPageLoading(true)
        const [servicesResponse, professionalsResponse] = await Promise.all([
          requestJson<Service[]>(`/${tenantId}/services`),
          requestJson<Professional[]>(`/${tenantId}/professionals`),
        ])

        setServices(servicesResponse)
        setProfessionals(professionalsResponse)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Não foi possível carregar serviços e profissionais.')
      } finally {
        setPageLoading(false)
      }
    })()
  }, [loading, tenantId])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setSelectedProfessional(null)
    setSelectedDate('')
    setSelectedTime('')
    setStep(2)
  }

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional)
    setStep(3)
  }

  const handleDateTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!tenantId || !selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      setError('Preencha todos os passos antes de confirmar.')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await requestJson(`/${tenantId}/appointments`, {
        method: 'POST',
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          serviceId: selectedService.id,
          professionalId: selectedProfessional.id,
          dateTime: toIsoDateTime(selectedDate, selectedTime),
          duration: selectedService.duration,
          price: selectedService.price,
          notes,
        }),
      })

      router.push('/dashboard/appointments')
    } catch (submitError) {
      console.error(submitError)
      setError('Não foi possível criar o agendamento. Verifique se o horário está disponível.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProfessionals = selectedService
    ? professionals.filter((professional) => professional.services.includes(selectedService.id))
    : professionals

  const timeSlots = useMemo(
    () => generateTimeSlots('09:00', '18:00', selectedService?.duration || 30),
    [selectedService?.duration]
  )

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <DashboardShell
      title="Novo agendamento"
      subtitle="Selecione serviço, profissional, horário e dados do cliente."
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard/appointments"
            className="rounded-xl bg-dark-100 p-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-montserrat text-3xl font-bold text-white">Novo Agendamento</h1>
            <p className="text-gray-400">Preencha os dados do agendamento</p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        ) : null}

        <div className="mb-8 flex items-center gap-4">
          {[1, 2, 3, 4].map((currentStep) => (
            <div key={currentStep} className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  step >= currentStep ? 'bg-gold text-dark' : 'bg-dark-100 text-gray-400'
                }`}
              >
                {currentStep}
              </div>
              {currentStep < 4 && <div className="h-1 w-16 bg-dark-100"></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <h2 className="mb-6 font-montserrat text-xl font-bold text-white">Escolha o Serviço</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="rounded-xl border border-dark-100 bg-dark-100 p-6 text-left transition-colors hover:border-gold"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                      <Scissors className="h-6 w-6 text-gold" />
                    </div>
                    <span className="text-2xl font-bold text-gold">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{service.name}</h3>
                  {service.description ? (
                    <p className="mb-3 text-sm text-gray-400">{service.description}</p>
                  ) : null}
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} minutos</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedService && (
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-montserrat text-xl font-bold text-white">Escolha o Profissional</h2>
              <button onClick={() => setStep(1)} className="text-gold hover:text-gold-light">
                Voltar
              </button>
            </div>

            <div className="mb-6 rounded-xl bg-gold/10 p-4">
              <div className="flex items-center gap-3">
                <Scissors className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm text-gray-400">Serviço selecionado</p>
                  <p className="font-medium text-white">{selectedService.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {filteredProfessionals.map((professional) => (
                <button
                  key={professional.id}
                  onClick={() => handleProfessionalSelect(professional)}
                  className="rounded-xl border border-dark-100 bg-dark-100 p-6 text-center transition-colors hover:border-gold"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                    <User className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{professional.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-montserrat text-xl font-bold text-white">Escolha Data e Horário</h2>
              <button onClick={() => setStep(2)} className="text-gold hover:text-gold-light">
                Voltar
              </button>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-gray-400">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-dark-100 bg-dark-100 p-4 text-white focus:border-gold focus:outline-none"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="mb-4 block text-gray-400">Horário</label>
                <div className="grid grid-cols-4 gap-3 md:grid-cols-7">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleDateTimeSelect(time)}
                      className="rounded-xl border border-dark-100 bg-dark-100 p-3 text-white transition-colors hover:border-gold"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-montserrat text-xl font-bold text-white">Dados do Cliente</h2>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-gold hover:text-gold-light"
              >
                Voltar
              </button>
            </div>

            <div className="mb-6 rounded-xl bg-gold/10 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Serviço</p>
                  <p className="font-medium text-white">{selectedService?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Profissional</p>
                  <p className="font-medium text-white">{selectedProfessional?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="font-medium text-white">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Horário</p>
                  <p className="font-medium text-white">{selectedTime}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-gold/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Valor Total</span>
                  <span className="text-2xl font-bold text-gold">
                    {selectedService ? formatCurrency(selectedService.price) : 'R$ 0,00'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-gray-400">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Digite o nome completo"
                  className="w-full rounded-xl border border-dark-100 bg-dark-100 p-4 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-400">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(event) => setClientPhone(event.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-dark-100 bg-dark-100 p-4 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-400">Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full rounded-xl border border-dark-100 bg-dark-100 p-4 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-400">Observações</label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Preferências ou detalhes do atendimento"
                  className="min-h-[120px] w-full resize-none rounded-xl border border-dark-100 bg-dark-100 p-4 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <button type="submit" disabled={submitting} className="w-full btn-primary py-4 text-lg">
                {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  )
}