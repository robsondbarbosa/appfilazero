import { Router } from 'express'
import { cancelExpiredAppointments, sendAppointmentReminders } from '../cron/appointments.cron'
import { checkBirthdaysAndNotify } from '../cron/birthday.cron'

const router = Router()
const cronSecret = process.env.CRON_SECRET

router.use((req, res, next) => {
  if (!cronSecret) {
    return res.status(503).json({ error: 'CRON_SECRET is not configured' })
  }

  const providedSecret = req.header('x-cron-secret')

  if (!providedSecret || providedSecret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized cron request' })
  }

  next()
})

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
