import { Router } from 'express'
import { cancelExpiredAppointments, sendAppointmentReminders } from '../cron/appointments.cron'
import { checkBirthdaysAndNotify } from '../cron/birthday.cron'

const router = Router()

/**
 * Endpoint para executar cron jobs manualmente
 * Útil para testes ou execução sob demanda
 * Em produção, deve ser protegido com autenticação de admin
 */

// Cancelar agendamentos expirados
router.post('/cancel-expired', async (req, res) => {
  try {
    await cancelExpiredAppointments()
    res.json({ success: true, message: 'Agendamentos expirados cancelados' })
  } catch (error) {
    console.error('Cron error:', error)
    res.status(500).json({ error: 'Erro ao executar cron job' })
  }
})

// Enviar lembretes de agendamento
router.post('/send-reminders', async (req, res) => {
  try {
    await sendAppointmentReminders()
    res.json({ success: true, message: 'Lembretes enviados' })
  } catch (error) {
    console.error('Cron error:', error)
    res.status(500).json({ error: 'Erro ao executar cron job' })
  }
})

// Verificar aniversários
router.post('/check-birthdays', async (req, res) => {
  try {
    await checkBirthdaysAndNotify()
    res.json({ success: true, message: 'Aniversários verificados' })
  } catch (error) {
    console.error('Cron error:', error)
    res.status(500).json({ error: 'Erro ao executar cron job' })
  }
})

export { router as cronRoutes }
