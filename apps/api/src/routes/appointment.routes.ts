import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/server'
import { AppointmentStatus } from '@filazero/types'
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  updateDoc,
  where,
  type Query,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'

type TenantParams = {
  tenantId: string
}

type AppointmentRecord = {
  id: string
  dateTime: {
    toDate: () => Date
  }
  [key: string]: unknown
}

const router = Router({ mergeParams: true })

const appointmentsCollection = collection(adminDb, 'appointments')
const paymentsCollection = collection(adminDb, 'payments')

// Get appointments for tenant
router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    const { professionalId, date } = req.query
    
    let appointmentsQuery: Query<DocumentData> = query(
      appointmentsCollection,
      where('tenantId', '==', tenantId),
      orderBy('dateTime', 'asc')
    )
    
    if (professionalId) {
      appointmentsQuery = query(
        appointmentsCollection,
        where('tenantId', '==', tenantId),
        where('professionalId', '==', professionalId),
        orderBy('dateTime', 'asc')
      )
    }
    
    const snapshot = await getDocs(appointmentsQuery)
    
    let appointments: AppointmentRecord[] = snapshot.docs.map((appointmentDoc: QueryDocumentSnapshot<DocumentData>) => ({
      id: appointmentDoc.id,
      ...appointmentDoc.data()
    })) as AppointmentRecord[]
    
    // Filter by date if provided (client-side filtering for date range)
    if (date) {
      const filterDate = new Date(date as string)
      const nextDay = new Date(filterDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      appointments = appointments.filter((apt) => {
        const aptDate = apt.dateTime.toDate()
        return aptDate >= filterDate && aptDate < nextDay
      })
    }
    
    res.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create appointment with double-booking prevention
router.post('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    const { 
      clientName, 
      clientEmail, 
      clientPhone,
      serviceId, 
      professionalId, 
      dateTime,
      duration,
      price,
      notes 
    } = req.body
    
    const startTime = new Date(dateTime)
    const endTime = new Date(startTime.getTime() + duration * 60000)
    
    // Transaction to prevent double-booking
    const result = await runTransaction(adminDb, async (transaction) => {
      // Check for conflicts
      const conflictsSnapshot = await ((transaction as unknown) as {
        get: (value: unknown) => Promise<{ docs: QueryDocumentSnapshot<DocumentData>[] }>
      }).get(
        query(
          appointmentsCollection,
          where('tenantId', '==', tenantId),
          where('professionalId', '==', professionalId),
          where('status', 'not-in', ['CANCELLED', 'NO_SHOW'])
        )
      )
      
      const conflicts = conflictsSnapshot.docs.filter((appointmentDoc) => {
        const apt = appointmentDoc.data()
        const aptStart = apt.dateTime.toDate()
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
        
        return (startTime < aptEnd && endTime > aptStart)
      })
      
      if (conflicts.length > 0) {
        throw new Error('TIME_CONFLICT')
      }
      
      // Create appointment
      const appointmentRef = doc(appointmentsCollection)
      const appointmentData = {
        tenantId,
        clientName,
        clientEmail,
        clientPhone,
        serviceId,
        professionalId,
        dateTime: startTime,
        duration,
        price,
        status: AppointmentStatus.PENDING,
        notes: notes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      transaction.set(appointmentRef, appointmentData)
      
      // Create payment record
      const paymentRef = doc(paymentsCollection, appointmentRef.id)
      transaction.set(paymentRef, {
        appointmentId: appointmentRef.id,
        tenantId,
        status: 'PENDING',
        amount: price,
        createdAt: new Date()
      })
      
      return { id: appointmentRef.id, ...appointmentData }
    })
    
    res.status(201).json(result)
  } catch (error: any) {
    if (error.message === 'TIME_CONFLICT') {
      return res.status(409).json({ error: 'Horário já reservado' })
    }
    console.error('Error creating appointment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Cancel appointment
router.put('/:id/cancel', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    
    await updateDoc(doc(appointmentsCollection, id), {
      status: AppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
      updatedAt: new Date()
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as appointmentRoutes }
