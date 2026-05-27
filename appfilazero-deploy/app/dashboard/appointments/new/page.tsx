'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react'

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

interface Professional {
  id: string
  name: string
  services: string[]
}

const services: Service[] = [
  { id: '1', name: 'Corte Masculino', price: 40, duration: 30 },
  { id: '2', name: 'Barba', price: 25, duration: 20 },
  { id: '3', name: 'Corte + Barba', price: 60, duration: 50 },
  { id: '4', name: 'Coloração', price: 150, duration: 120 },
  { id: '5', name: 'Hidratação', price: 80, duration: 60 }
]

const professionals: Professional[] = [
  { id: '1', name: 'Carlos', services: ['1', '2', '3'] },
  { id: '2', name: 'Ana', services: ['4', '5'] },
  { id: '3', name: 'Pedro', services: ['1', '2', '3', '4', '5'] }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function NewAppointmentPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui integraria com a API
    alert('Agendamento criado com sucesso!')
    window.location.href = '/dashboard'
  }

  const filteredProfessionals = selectedService
    ? professionals.filter(p => p.services.includes(selectedService.id))
    : professionals

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-dark-100 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-white">
              Novo Agendamento
            </h1>
            <p className="text-gray-400">Preencha os dados do agendamento</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-gold text-dark' : 'bg-dark-100 text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 4 && <div className="w-16 h-1 bg-dark-100"></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-montserrat font-bold text-white mb-6">
              Escolha o Serviço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="p-6 rounded-xl bg-dark-100 border border-dark-100 hover:border-gold transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-gold" />
                    </div>
                    <span className="text-2xl font-bold text-gold">
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} minutos</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Professional */}
        {step === 2 && selectedService && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat font-bold text-white">
                Escolha o Profissional
              </h2>
              <button
                onClick={() => setStep(1)}
                className="text-gold hover:text-gold-light"
              >
                Voltar
              </button>
            </div>

            <div className="mb-6 p-4 bg-gold/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-gold" />
                <div>
                  <p className="text-gray-400 text-sm">Serviço selecionado</p>
                  <p className="text-white font-medium">{selectedService.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProfessionals.map((professional) => (
                <button
                  key={professional.id}
                  onClick={() => handleProfessionalSelect(professional)}
                  className="p-6 rounded-xl bg-dark-100 border border-dark-100 hover:border-gold transition-colors text-center"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{professional.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat font-bold text-white">
                Escolha Data e Horário
              </h2>
              <button
                onClick={() => setStep(2)}
                className="text-gold hover:text-gold-light"
              >
                Voltar
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 bg-dark-100 border border-dark-100 rounded-xl text-white focus:border-gold focus:outline-none"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-gray-400 mb-4">Horário</label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleDateTimeSelect(time)}
                      className="p-3 rounded-xl bg-dark-100 border border-dark-100 hover:border-gold transition-colors text-white"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Client Data */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-montserrat font-bold text-white">
                Dados do Cliente
              </h2>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-gold hover:text-gold-light"
              >
                Voltar
              </button>
            </div>

            <div className="mb-6 p-4 bg-gold/10 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Serviço</p>
                  <p className="text-white font-medium">{selectedService?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Profissional</p>
                  <p className="text-white font-medium">{selectedProfessional?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data</p>
                  <p className="text-white font-medium">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Horário</p>
                  <p className="text-white font-medium">{selectedTime}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gold/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Valor Total</span>
                  <span className="text-2xl font-bold text-gold">
                    R$ {selectedService?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Digite o nome completo"
                  className="w-full p-4 bg-dark-100 border border-dark-100 rounded-xl text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full p-4 bg-dark-100 border border-dark-100 rounded-xl text-white focus:border-gold focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-4 text-lg">
                Confirmar Agendamento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

