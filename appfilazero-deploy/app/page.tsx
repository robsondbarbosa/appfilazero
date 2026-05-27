import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, CreditCard, Shield, Star, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FilaZero - Agendamento Inteligente',
  description: 'Agendou, chegou. Sem fila. Sistema de agendamento para salões e barbearias.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-400">
      {/* Header */}
      <header className="border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-dark" />
            </div>
            <span className="font-montserrat font-bold text-2xl text-gradient-gold">
              FilaZero
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-gold transition-colors">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-gold transition-colors">
              Preços
            </a>
            <a href="#contact" className="text-gray-300 hover:text-gold transition-colors">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gold hover:text-gold-light transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn-primary"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-montserrat font-bold text-5xl md:text-7xl leading-tight mb-6">
              Agendou, chegou.
              <br />
              <span className="text-gradient-gold">Sem fila.</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Sistema completo de agendamento para salões de beleza e barbearias. 
              Gerencie seus horários, profissionais e pagamentos em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Criar Conta Grátis
              </Link>
              <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
                Ver Demonstração
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              14 dias grátis. Não precisa de cartão de crédito.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-dark-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-gray-400 text-lg">
              Ferramentas completas para gerenciar seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Agendamento Online',
                description: 'Seus clientes agendam 24h por dia, 7 dias por semana, sem precisar ligar.',
              },
              {
                icon: Users,
                title: 'Gestão de Profissionais',
                description: 'Cadastre seus atendentes, defina horários e serviços que cada um realiza.',
              },
              {
                icon: CreditCard,
                title: 'Pagamento Integrado',
                description: 'Aceite PIX e cartão com integração Mercado Pago. Seguro e rápido.',
              },
              {
                icon: Clock,
                title: 'Controle de Horários',
                description: 'Bloqueie dias de folga, defina horários de almoço e feriados.',
              },
              {
                icon: Shield,
                title: 'Sem Double-Booking',
                description: 'Sistema inteligente evita agendamentos no mesmo horário.',
              },
              {
                icon: Star,
                title: 'Lembretes Automáticos',
                description: 'Seus clientes recebem lembretes por email 24h antes do atendimento.',
              },
            ].map((feature, index) => (
              <div key={index} className="card group">
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-gold rounded-3xl p-12 md:p-16 text-center text-dark">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de salões e barbearias que já usam o FilaZero 
              para organizar seus agendamentos.
            </p>
            
            <Link
              href="/register"
              className="inline-block bg-dark text-gold font-bold text-lg px-10 py-4 rounded-xl
                         hover:bg-dark-100 transition-colors duration-300"
            >
              Criar Minha Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-dark" />
              </div>
              <span className="font-montserrat font-bold text-xl text-gradient-gold">
                FilaZero
              </span>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 FilaZero. Todos os direitos reservados.
            </p>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gold transition-colors">
                Termos
              </a>
              <a href="#" className="text-gray-500 hover:text-gold transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-gray-500 hover:text-gold transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

