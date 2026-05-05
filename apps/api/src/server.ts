import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

import { tenantRoutes } from './routes/tenant.routes'
import { serviceRoutes } from './routes/service.routes'
import { professionalRoutes } from './routes/professional.routes'
import { appointmentRoutes } from './routes/appointment.routes'
import { paymentRoutes } from './routes/payment.routes'
import { cronRoutes } from './routes/cron.routes'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/tenants', tenantRoutes)
app.use('/:tenantId/services', serviceRoutes)
app.use('/:tenantId/professionals', professionalRoutes)
app.use('/:tenantId/appointments', appointmentRoutes)
app.use('/:tenantId/payments', paymentRoutes)
app.use('/webhooks', paymentRoutes)
app.use('/cron', cronRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🚀 FilaZero API running on port ${PORT}`)
})

export default app
