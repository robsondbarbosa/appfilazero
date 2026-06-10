'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CreditCard,
  MessageSquare,
  Scissors,
  ShieldCheck,
  Users,
} from 'lucide-react'

const highlights = [
  {
    icon: Calendar,
    title: 'Agenda inteligente',
    description: 'Controle disponibilidade, horários e confirme atendimentos com poucos cliques.',
  },
  {
    icon: Users,
    title: 'Cadastro de clientes',
    description: 'Acompanhe recorrência, histórico de visitas e faturamento por cliente.',
  },
  {
    icon: CreditCard,
    title: 'Receita por serviço',
    description: 'Tenha visão clara dos serviços mais vendidos e do valor gerado por dia.',
  },
  {
    icon: MessageSquare,
    title: 'Experiência do cliente',
    description: 'Ofereça confirmação rápida e comunicações claras em todos os atendimentos.',
  },
]

const metrics = [
  { label: 'Agendamentos por dia', value: '120+' },
  { label: 'Redução de faltas', value: '32%' },
  { label: 'Tempo economizado', value: '8h/semana' },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
              <Scissors className="h-7 w-7 text-dark" />
            </div>
            <span className="font-montserrat text-3xl font-bold text-gradient-gold">FilaZero</span>
          </Link>

          <div className="flex gap-3">
            <Link href="/login" className="btn-secondary px-5 py-3">
              Entrar
            </Link>
            <Link href="/register" className="btn-primary px-5 py-3">
              Criar conta
            </Link>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="card p-8">
            <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm text-gold">
              Demonstração do sistema
            </span>
            <h1 className="mt-6 font-montserrat text-5xl font-bold text-white">
              Visualize sua operação organizada em um único painel
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-gray-400">
              O FilaZero foi pensado para salões, barbearias e clínicas que precisam vender mais,
              reduzir atrasos e oferecer uma experiência moderna para seus clientes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-4">
                Começar agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2 px-6 py-4">
                Ver painel
                <BarChart3 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-gold" />
                <h2 className="font-montserrat text-xl font-bold text-white">Resultados esperados</h2>
              </div>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-dark-100 bg-dark-200 p-4">
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {highlights.map((item) => (
            <div key={item.title} className="card p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h2 className="font-montserrat text-2xl font-bold text-white">{item.title}</h2>
              <p className="mt-3 text-gray-400">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 card p-8">
          <h2 className="font-montserrat text-3xl font-bold text-white">O que você encontra no produto</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              'Gestão completa de clientes e histórico de consumo',
              'Cadastro e manutenção de serviços com duração e preço',
              'Painel de agendamentos com visão por status e profissional',
              'Configurações do estabelecimento com dados comerciais',
              'Estrutura preparada para integração com pagamentos',
              'Experiência visual consistente para equipe e gestão',
            ].map((feature) => (
              <div key={feature} className="rounded-2xl border border-dark-100 bg-dark-200 p-4 text-gray-300">
                {feature}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}