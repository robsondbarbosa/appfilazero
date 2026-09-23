import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/server'

const router = Router({ mergeParams: true })
const appointmentsCollection = adminDb.collection('appointments')

type TenantParams = {
  tenantId: string
}

type ClientSummary = {
  id: string
  name: string
  email: string
  phone: string
  totalAppointments: number
  totalSpent: number
  lastAppointment: string | null
}

type AppointmentClientData = {
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  price?: number
  dateTime?: FirebaseFirestore.Timestamp | Date | string
}

function toDate(value: AppointmentClientData['dateTime']): Date | null {
  if (value instanceof Date) {
    return value
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate()
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params

    const snapshot = await appointmentsCollection
      .where('tenantId', '==', tenantId)
      .get()

    const clientsMap = new Map<string, ClientSummary>()

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as AppointmentClientData
      const clientKey =
        data.clientEmail?.trim().toLowerCase() ||
        data.clientPhone?.trim() ||
        `${data.clientName || 'Cliente'}-${doc.id}`

      const appointmentDate = toDate(data.dateTime)
      const nextLastAppointment = appointmentDate?.toISOString() || null
      const current = clientsMap.get(clientKey)

      if (!current) {
        clientsMap.set(clientKey, {
          id: clientKey,
          name: data.clientName || 'Cliente sem nome',
          email: data.clientEmail || '',
          phone: data.clientPhone || '',
          totalAppointments: 1,
          totalSpent: typeof data.price === 'number' ? data.price : 0,
          lastAppointment: nextLastAppointment,
        })
        return
      }

      clientsMap.set(clientKey, {
        ...current,
        name: current.name || data.clientName || 'Cliente sem nome',
        email: current.email || data.clientEmail || '',
        phone: current.phone || data.clientPhone || '',
        totalAppointments: current.totalAppointments + 1,
        totalSpent: current.totalSpent + (typeof data.price === 'number' ? data.price : 0),
        lastAppointment:
          current.lastAppointment && nextLastAppointment
            ? new Date(current.lastAppointment) > new Date(nextLastAppointment)
              ? current.lastAppointment
              : nextLastAppointment
            : current.lastAppointment || nextLastAppointment,
      })
    })

    const clients = Array.from(clientsMap.values()).sort((left, right) => {
      if (!left.lastAppointment && !right.lastAppointment) {
        return left.name.localeCompare(right.name)
      }

      if (!left.lastAppointment) {
        return 1
      }

      if (!right.lastAppointment) {
        return -1
      }

      return new Date(right.lastAppointment).getTime() - new Date(left.lastAppointment).getTime()
    })

    res.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as clientsRoutes }
